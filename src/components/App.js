import '../assets/css/App.css';
import '../assets/css/font-awesome.css';
import '../assets/css/font-roboto.css';

import decode_card from '../utils/Decode';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import FontAwesome from 'react-fontawesome';
import Typography from 'material-ui/Typography';
import HallInfo from './HallInfo';
import Clock from './Clock';
import Display from './Display';
import CfgDialog from './CfgDialog';
import SyncPanel from './SyncPanel';
import CoursesDialog from './CoursesDialog';
import CoursesChips from './CoursesChips';


import {startSync,stopSync,findRefGid,getCoursesTree,registerDBCallback,getSyncState,getCourse} from '../utils/Db';


const styles  = theme => ({ 
    full: {
      //height: '95vh'  
    },
    gridContainer: {
      border: '1px solid black',
    },
    gridItem: {
      border: '1px solid red',
    },
    gridPaper: {
      //overflow: 'scroll'
    }
});

const heightSub = 250;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      message: "hi!", 
      activeSync: false, 
      syncOk:null, 
      cfgOpen: false, 
      coursesOpen: false, 
      activeCourses:[], 
      activeHostCourses:[], 
      coursesList:[],
      winHeight: 500,
      winWidth: 500,
    };
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

  onCoursesButton(e) {
    console.log("courses button!");
    this.setState({coursesOpen:true})
  }

  onTestSetupButton(e) {
    console.log("test setup button!");
    getCourse("agpzfnRzLXphcGlzchMLEgZDb3Vyc2UYgICA2IL3kAoM",c=>{
      this.setState({activeCourses:[c]});
    })
  }

  onDBChange(e) {
    console.log("onDBChange",e)
    this.setState({activeSync:e.active,syncOk:e.ok,apiReady:e.apiReady});
  } 

  handleActiveCoursesList(courses,hosts) {
    console.log("handleActiveCoursesList")
    this.setState({activeCourses:courses,activeHostCourses:hosts})
  }
 
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

    registerDBCallback((e)=>{this.onDBChange(e)});
    this.setState({activeSync:getSyncState().active, syncOk:getSyncState().ok});
    getCoursesTree((list)=>{
      console.log("list ready",list)
      this.setState({coursesList:list})
    })
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
    registerDBCallback(null);
  }

  updateDimensions() {
    //console.log("updateDimensions", window.innerWidth, "x", window.innerHeight)
    this.setState({ winWidth: window.innerWidth, winHeight: window.innerHeight });
  }




  render() {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12}>
          <Paper className={classes.gridPaper}>
            <CfgDialog open={this.state.cfgOpen} onRequestClose={(e)=>this.setState({cfgOpen:false})}/>
            <CoursesDialog 
              open={this.state.coursesOpen} 
              onRequestClose={(e)=>this.setState({coursesOpen:false})}
              courses={this.state.coursesList}
              activeCourses = {this.state.activeCourses}
              activeHostCourses = {this.state.activeHostCourses}
              onSave={(courses,hosts)=>this.handleActiveCoursesList(courses,hosts)}
            />   
            <SyncPanel activeSync={this.state.activeSync} syncOk={this.state.syncOk} apiReady={this.state.apiReady}/>
            <Button raised color="primary" onClick={(e)=>this.onButton(e)}>Primary</Button>
            <Button raised color="primary" onClick={(e)=>this.onCfgButton(e)}>Cfg</Button>
            <Button raised color="primary" onClick={(e)=>this.onCoursesButton(e)}>Courses</Button>
            <Button raised color="primary" onClick={(e)=>this.onTestSetupButton(e)}>TestSetup</Button>
            </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.gridPaper}>
            <Typography type="display3" align="center">
              <Clock />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper className={classes.gridPaper}>
            <Typography type="display3" align="center">
              <HallInfo male={1} female={5}/>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}  >
          <Paper className={classes.gridPaper} style={{overflow: 'scroll', height: this.state.winHeight-heightSub}}>
            <Typography type="headline" align="center"> Vstup pro kurz </Typography>
            <CoursesChips courses={this.state.activeCourses} />
            <Typography type="headline" align="center"> Hostování z kurzů </Typography>
            <CoursesChips courses={this.state.activeHostCourses} />
          </Paper>
        </Grid>
        <Grid item xs={8} >
          <Paper className={classes.gridPaper} style={{height: this.state.winHeight-heightSub}}>
            <Display activeScan={true} message={this.state.message}/>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper  className={classes.gridPaper}>
            <p> message: {this.state.message} </p>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

/*
 <Display activeScan={true} message={this.state.message}/>
 <CoursesChips courses={this.state.activeHostCourses} />
 <CoursesChips courses={this.state.activeCourses} />
 <HallInfo male={1} female={5}/>

*/

export default withStyles(styles)(App);