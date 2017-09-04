import '../assets/css/App.css';
import '../assets/css/font-awesome.css';
import '../assets/css/font-roboto.css';


import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AccessAlarmIcon from 'material-ui-icons/AccessAlarm';
import FontAwesome from 'react-fontawesome';


var Datastore = require('nedb');


var test_db = new Datastore({ filename: 'test.db', autoload: true });

const pMap = require('p-map');
var axios = require('axios');
var remote_api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 5000,
  headers: {'x-remoteapi-secret': 'supersecrettoken'}
});




class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { message: "hi!"};
  }
  onButton(e) {
    console.log("button!");
    remote_api.get("/todos").then(res=>{
      this.setState({message:JSON.stringify(res)});
    });
  }
  render() {
    return (
      <div>
        <h1>Hello, Electron!</h1>
        <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
        <Button raised color="primary" onClick={(e)=>this.onButton(e)}>
          Primary
        </Button>
        <AccessAlarmIcon/>
        <FontAwesome spin={true} className="text-danger" name="spinner" size="3x" />
        <p> message: {this.state.message} </p>
      </div>
    );
  }
}

export default App;
