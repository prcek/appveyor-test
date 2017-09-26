import '../assets/css/App.css';
import '../assets/css/font-awesome.css';
import '../assets/css/font-roboto.css';


import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import CfgIcon from 'material-ui-icons/Settings';
import DevIcon from 'material-ui-icons/Build';
import InputIcon from 'material-ui-icons/Input';
import QuitIcon from 'material-ui-icons/PowerSettingsNew';
import DeleteIcon from 'material-ui-icons/DeleteForever';
import FullScreenIcon from 'material-ui-icons/SettingsOverscan';
import TestIcon from 'material-ui-icons/TouchApp';
import CloudIcon from 'material-ui-icons/CloudDownload';
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
import ScanLine from './ScanLine';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import {startSync,stopSync,findRefGid,getCoursesTree,registerDBCallback,getSyncState,getCourse, getCourses} from '../utils/Db';
import ECom from '../utils/ECom';

import Cfg from '../utils/Cfg';

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
    },
    button: {
      margin: theme.spacing.unit,
    },
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
      message_type: "init",
      activeSync: false, 
      syncOk:null, 
      cfgOpen: false, 
      coursesOpen: false, 
      activeCourses:[], 
      activeHostMCourses:[], 
      activeHostFCourses:[], 
      activeStudents:[],
      coursesList:[],
      winHeight: 500,
      winWidth: 500,
    };
    this.cfg = new Cfg();
    this.updateDimensions = this.updateDimensions.bind(this);
    this.hideTimeout = null;
    this.flashTimeout = null;
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

  onResetButton(e) {
    console.log("reset button!");
    this.setState({activeStudents:[]})
  }

  onFullScreenButton(e) {
    console.log("fullscreen button!");
    ECom.toggleFullScreen();
  }

  onQuitButton(e) {
    console.log("quit button!");
    ECom.appQuit();
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
    //console.log("onDBChange",e)
    this.setState({activeSync:e.active,syncOk:e.ok,apiReady:e.apiReady});
  } 

  handleActiveCoursesList(courses,mhosts,fhosts) {
    console.log("handleActiveCoursesList")
    this.setState({activeCourses:courses,activeHostMCourses:mhosts,activeHostFCourses:fhosts})
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
    if (this.cfg.full_screen) {
      console.log("set fullscreen")
      ECom.setFullScreen();
    } else {
      console.log("clear fullscreen")
    }

    if (this.cfg.startup_sync) {
      console.log("auto startup sync")
      startSync();
    }

  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    registerDBCallback(null);
  }

  updateDimensions() {
    //console.log("updateDimensions", window.innerWidth, "x", window.innerHeight)
    this.setState({ winWidth: window.innerWidth, winHeight: window.innerHeight });
  }

  restartHideTimeout() {
    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = setTimeout(()=>{
      this.hideTimeout = null;
      this.setState({message:"",message_type:"idle"})
    },3000)
  }
  restartFlashTimeout() {
    if (this.flashTimeout !== null) {
      clearTimeout(this.flashTimeout);
    }
    this.flashTimeout = setTimeout(()=>{
      this.flashTimeout = null;
      this.setState({message_flash:false})
    },100)
  }


  showMsg(msg,type) {
    this.setState({message: msg, message_type:type,message_flash:true})
    this.restartFlashTimeout();
    this.restartHideTimeout();
  }

  onScanStudent(card,student,course,raw_data) {
    console.log("onScanStudent",card,student,course);
    if (student === null) {
      this.showMsg("neznámý žák","error");
      return;
    } 
    if (course === null) {
      this.showMsg("žák z neznámého kurzu","error");
      return;
    }    

    if (this.isInActiveList(this.state.activeStudents,student)) {
      this.showMsg("opakovaný vstup","error");
      return;
    }


    if (this.isInActiveList(this.state.activeCourses,course)) {
      this.setState({activeStudents:[...this.state.activeStudents,student]});
      this.showMsg("vstup ok","ok");
      return;
    }

    if ((student.sex === "m") && (this.isInActiveList(this.state.activeHostMCourses,course))) {
      this.setState({activeStudents:[...this.state.activeStudents,student]});
      this.showMsg("host ok","ok");
      return;
    }

    if ((student.sex === "f") && (this.isInActiveList(this.state.activeHostFCourses,course))) {
      this.setState({activeStudents:[...this.state.activeStudents,student]});
      this.showMsg("host ok","ok");
      return;
    }

    this.showMsg("vstup zamítnut","error");


  }

  isInActiveList(list,course) {
    const fc = list.find((c)=>{
      return (c._id === course._id);
    })
    return fc !== undefined;
  }

  onScanCmd(cmd,course,raw_data) {
    console.log("onScanCmd",cmd,course);
    if (course === null) {
      this.showMsg("neznámý kurz","error");
      return;
    } 
    console.log(cmd.id);
    switch(cmd.id) {
      case "C_SETUP":
        this.setState({activeCourses:[course], activeStudents:[]});
        this.showMsg("nastaven kurz","setup");
      break;
      case "C_SETUP_GM":
        getCourses(course.season_key, course.folder_key, (list)=>{
          console.log("MHost list:",list);
          this.setState({activeCourses:[course], activeHostMCourses:list, activeStudents:[]});
          this.showMsg("nastaven kurz + hostování","setup");
        });
      break;
      case "C_ADD":
        if (this.isInActiveList(this.state.activeCourses,course)) {
          this.showMsg("kurz je již vybrán","error"); 
        } else {
          this.setState({activeCourses:[...this.state.activeCourses,course]});
          this.showMsg("přidán kurz","setup");
        }
      break;
      case "C_ADD_M":
        if (this.isInActiveList(this.state.activeHostMCourses,course)) {
          this.showMsg("kurz je již vybrán","error"); 
        } else {
          this.setState({activeHostMCourses:[...this.state.activeHostMCourses,course]});
          this.showMsg("přidán kurz","setup");
        }
      break;
      case "C_ADD_F":
        if (this.isInActiveList(this.state.activeHostFCourses,course)) {
          this.showMsg("kurz je již vybrán","error"); 
        } else {
          this.setState({activeHostFCourses:[...this.state.activeHostFCourses,course]});
          this.showMsg("přidán kurz","setup");
        }
      break;
      default:
        this.showMsg("neznámá ovládací karta","error"); 
    }
  }
  onScanError(msg,raw_data) {
    console.log("onScanError",msg);
    this.showMsg(msg,"error");
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
            <div>
              <CfgDialog open={this.state.cfgOpen} onRequestClose={(e)=>this.setState({cfgOpen:false})}/>
              <CoursesDialog 
                open={this.state.coursesOpen} 
                onRequestClose={(e)=>this.setState({coursesOpen:false})}
                courses={this.state.coursesList}
                activeCourses = {this.state.activeCourses}
                activeHostMCourses = {this.state.activeHostMCourses}
                activeHostFCourses = {this.state.activeHostFCourses}
                onSave={(courses,mhosts,fhosts)=>this.handleActiveCoursesList(courses,mhosts,fhosts)}
              />   
              <Grid container className={classes.gridContainer} justify={"space-around"} >
                <Tooltip title="Aktualizace DB">
                  <Button raised className={classes.button} color="primary" disabled={this.state.activeSync} onClick={(e)=>this.onSyncButton(e)}><CloudIcon/></Button>  
                </Tooltip>
                <Tooltip title="Konfigurace">
                  <Button raised className={classes.button} color="primary" onClick={(e)=>this.onCfgButton(e)}><CfgIcon/></Button>
                </Tooltip>
                <Tooltip title="Nastavení vstupu">
                  <Button raised className={classes.button} color="primary" onClick={(e)=>this.onCoursesButton(e)}><InputIcon/></Button>
                </Tooltip>
                <Tooltip title="Vynulování počítadla">
                  <Button raised className={classes.button} color="primary" onClick={(e)=>this.onResetButton(e)}><DeleteIcon/></Button>
                </Tooltip>
                { this.cfg.debug && <Button raised className={classes.button} color="primary" onClick={(e)=>this.onTestSetupButton(e)}><TestIcon/></Button> }
                <Tooltip title="Celo-obrazovkový mód">
                  <Button raised className={classes.button} color="primary" onClick={(e)=>this.onFullScreenButton(e)}><FullScreenIcon/></Button>
                </Tooltip>  
                { this.cfg.debug && <Button raised className={classes.button} color="primary" onClick={(e)=>this.onDevToolButton(e)}><DevIcon/></Button> }
                <Tooltip title="Vypnutí">
                  <Button raised className={classes.button} color="primary" onClick={(e)=>this.onQuitButton(e)}><QuitIcon/></Button>
                </Tooltip>
              </Grid>
            </div>
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
                <HallInfo students={this.state.activeStudents}/>
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <div className={classes.gridSeparator}/>
          </Grid>

          <Grid item xs={4}  >
            <Paper className={classes.gridPaper} style={{overflow: 'scroll', height: this.state.winHeight-heightSub}}>
              { this.state.activeCourses.length==0 && <Typography type="headline" align="center"> Není zvolen kurz pro vstup </Typography>}
              { this.state.activeCourses.length>0 && <Typography type="headline" align="center"> Vstup pro kurz </Typography>}
              <CoursesChips courses={this.state.activeCourses} />
              { this.state.activeHostMCourses.length>0 && <Typography type="headline" align="center"> Hostování kluci </Typography>}
              <CoursesChips courses={this.state.activeHostMCourses} />
              { this.state.activeHostFCourses.length>0 && <Typography type="headline" align="center"> Hostování holky </Typography>}
              <CoursesChips courses={this.state.activeHostFCourses} />
            </Paper>
          </Grid>
          <Grid item xs={8} >
            <Grid container align={'center'} justify={'center'} style={{height: this.state.winHeight-heightSub}}>
               <Grid item>
                  <Display flash={this.state.message_flash} message={this.state.message} message_type={this.state.message_type}/>
               </Grid >
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper  className={classes.gridPaper}>
              <ScanLine 
                active={!(this.state.cfgOpen || this.state.coursesOpen)}
                onScanStudent = {(card,st,cs,rd)=>this.onScanStudent(card,st,cs,rd)}
                onScanCmd = {(cmd,c,rd)=>this.onScanCmd(cmd,c,rd)}
                onScanError = {(msg,rd)=>this.onScanError(msg,rd)}
              />
            </Paper>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);