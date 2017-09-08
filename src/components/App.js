import '../assets/css/App.css';
import '../assets/css/font-awesome.css';
import '../assets/css/font-roboto.css';

import decode_card from '../utils/Decode';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AccessAlarmIcon from 'material-ui-icons/AccessAlarm';
import FontAwesome from 'react-fontawesome';

import HallInfo from './HallInfo';
import Display from './Display';
import CfgDialog from './CfgDialog';
import SyncPanel from './SyncPanel';
import CoursesTree from './CoursesTree';

import {startSync,stopSync,findRefGid,getCoursesTree,registerDBCallback,getSyncState} from '../utils/Db';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { message: "hi!", activeSync: false, syncOk:null, cfgOpen: false, activeCourses:[], activeHostCourses:[], coursesList:[]};
  }
  onButton(e) {
    console.log("button!");
    this.setState({message:'hello!'})
    startSync();
    //const dc = decode_card("TS*69626*eJyrVipLLVKyUgoJNlTSUcpMUbIyszQzMtNRKk5NLM7PA8oYGRia6xtaAGWT80uLilOBQiCleYm5IKZLYhlQE1B5aRFUJKbUwNDMoAREGSYVACmDVMM8kIrUCqBsrlItACfLIG4=*2933823073*302954397**");
    //console.log(dc);
    //findRefGid(dc.id,(res)=>{
    //  console.log(res);
    //})
    getCoursesTree((tree)=>{
      console.log(tree);
    })
  }

  onCfgButton(e) {
    console.log("cfg button!");
    this.setState({cfgOpen:true})
  }

  onDBChange(e) {
    console.log("onDBChange",e)
    this.setState({activeSync:e.active,syncOk:e.ok});
  } 

  handleActiveCourse(id,state) {
    console.log("handleActiveCourse",id,state);

    const { activeCourses } = this.state;
    const currentIndex = activeCourses.indexOf(id);
    const newActiveCourses = [...activeCourses];

    if (currentIndex === -1) {
      newActiveCourses.push(id);
    } else {
      newActiveCourses.splice(currentIndex, 1);
    }

    this.setState({
      activeCourses: newActiveCourses,
    });

  }

  handleActiveHostCourse(id,state) {
    console.log("handleActiveHostCourse",id,state);

    const { activeHostCourses } = this.state;
    const currentIndex = activeHostCourses.indexOf(id);
    const newActiveHostCourses = [...activeHostCourses];

    if (currentIndex === -1) {
      newActiveHostCourses.push(id);
    } else {
      newActiveHostCourses.splice(currentIndex, 1);
    }

    this.setState({
      activeHostCourses: newActiveHostCourses,
    });

  }
 
  componentDidMount() {
    registerDBCallback((e)=>{this.onDBChange(e)});
    this.setState({activeSync:getSyncState().active, syncOk:getSyncState().ok});
    getCoursesTree((list)=>{
      console.log("list ready",list)
      this.setState({coursesList:list})
    })
  }
  componentWillUnmount() {
    registerDBCallback(null);
  }

  render() {
    return (
      <div>
        <CfgDialog open={this.state.cfgOpen} onRequestClose={(e)=>this.setState({cfgOpen:false})}/>
        <h1>Hello, Electron!</h1>
        <SyncPanel activeSync={this.state.activeSync} syncOk={this.state.syncOk}/>
        <HallInfo male={1} female={5}/>
        <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
        <Button raised color="primary" onClick={(e)=>this.onButton(e)}>
          Primary
        </Button>
        <Button raised color="primary" onClick={(e)=>this.onCfgButton(e)}>
          Cfg
        </Button>
        <CoursesTree 
          courses={this.state.coursesList} 
          activeCourses={this.state.activeCourses} 
          activeHostCourses={this.state.activeHostCourses} 
          onActiveCourse={(id,state)=>this.handleActiveCourse(id,state)} 
          onActiveHostCourse={(id,state)=>this.handleActiveHostCourse(id,state)} 
          />
        <p> message: {this.state.message} </p>
        <Display activeScan={true} message={this.state.message}/>
      </div>
    );
  }
}

export default App;
