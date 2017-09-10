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

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import {startSync,stopSync,findRefGid,getCoursesTree,registerDBCallback,getSyncState,getCourse} from '../utils/Db';
import ECom from '../utils/ECom';



const muitheme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
  typography: {
    display3: {
      color: 'rgba(255, 255, 255, 1)'
    }
  }
});

const styles  = theme => ({ 
    full: {
      //height: '95vh'  
    },
    gridContainer: {
      border: '1px solid red',
    },
    gridItem: {
      border: '1px solid blue',
    },
    gridPaper: {
      //overflow: 'scroll'
    },
    gridSeparator: {
      background: 'white',
      height: '2px',
      margin: '0px',
      paggind: '0px'
    }
});

const heightSub = 300;

//Node <script>document.write(process.versions.node)</script>,
//Chromium <script>document.write(process.versions.chrome)</script>,
//Electron <script>document.write(process.versions.electron)</script>,

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
    this.updateDimensions = this.updateDimensions.bind(this);
  }
  onSyncButton(e) {
    console.log("sync button!");
    startSync();
  }

  onCfgButton(e) {
    console.log("cfg button!");
    this.setState({cfgOpen:true})
  }

  onCoursesButton(e) {
    console.log("courses button!");
    this.setState({coursesOpen:true})
  }

  onFullScreenButton(e) {
    console.log("fullscreen button!");
    ECom.toggleFullScreen();
  }

  onDevToolButton(e) {
    console.log("devtool button!");
    ECom.openDevTools();
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
    window.addEventListener("resize", this.updateDimensions);

    registerDBCallback((e)=>{this.onDBChange(e)});
    this.setState({activeSync:getSyncState().active, syncOk:getSyncState().ok});
    getCoursesTree((list)=>{
      console.log("list ready",list)
      this.setState({coursesList:list})
    })
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    registerDBCallback(null);
  }

  updateDimensions() {
    //console.log("updateDimensions", window.innerWidth, "x", window.innerHeight)
    this.setState({ winWidth: window.innerWidth, winHeight: window.innerHeight });
  }




  render() {
    const classes = this.props.classes;
    return (
      <MuiThemeProvider theme={muitheme}>
        <Grid container className={classes.gridContainer}>
          <Grid item xs={4}>
            <Paper className={classes.gridPaper}>
              <SyncPanel activeSync={this.state.activeSync} syncOk={this.state.syncOk} apiReady={this.state.apiReady}/>
            </Paper>
          </Grid>
          <Grid item xs={8}>
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
              <Button raised color="primary" onClick={(e)=>this.onSyncButton(e)}>Sync</Button>
              <Button raised color="primary" onClick={(e)=>this.onCfgButton(e)}>Cfg</Button>
              <Button raised color="primary" onClick={(e)=>this.onCoursesButton(e)}>Courses</Button>
              <Button raised color="primary" onClick={(e)=>this.onTestSetupButton(e)}>TestSetup</Button>
              <Button raised color="primary" onClick={(e)=>this.onFullScreenButton(e)}>FullScreen</Button>
              <Button raised color="primary" onClick={(e)=>this.onDevToolButton(e)}>DevTool</Button>
              </Paper>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.gridSeparator}/>
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

          <Grid item xs={12}>
            <div className={classes.gridSeparator}/>
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
            <Grid container align={'center'} justify={'center'} style={{height: this.state.winHeight-heightSub}}>
               <Grid item>
                  <Display activeScan={true} message={this.state.message}/>
               </Grid >
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper  className={classes.gridPaper}>
              <p> message: {this.state.message} </p>
            </Paper>
          </Grid>
        </Grid>
      </MuiThemeProvider>
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