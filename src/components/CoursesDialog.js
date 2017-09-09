

import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';

import PropTypes from 'prop-types';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import { withStyles } from 'material-ui/styles';

import FontAwesome from 'react-fontawesome';

const styles  = theme => ({ 

    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },

    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
   
    root: {
        //display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'scroll',
        //background: theme.palette.background.paper,
    },
    list: {
        width: 500,
        height: 450,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
});


class CoursesTree extends Component {

    constructor(props) {
        super(props);
    }

    handleCheck(n,checked) {
        this.props.onActiveCourse(n._id,checked);
    }
    handleCheckHost(n,checked) {
        this.props.onActiveHostCourse(n._id,checked);
    }


    renderCourse(c) {
        return (
            <ListItem key={c._id} dense>
                <ListItemText primary={c.code + " " + c.name}/>
                <ListItemSecondaryAction>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.props.activeCourses.indexOf(c._id) !== -1}
                                onChange={(event, checked) => this.handleCheck(c,checked)}
                            />
                        }
                        label="Vstup"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.props.activeHostCourses.indexOf(c._id) !== -1}
                                onChange={(event, checked) => this.handleCheckHost(c,checked)}
                           />
                        }
                        label="Hostování"
                    />
                </ListItemSecondaryAction>
            </ListItem> 
        )
    }

    renderCourses(list) {
        return (
            <ListItem key={list.season._id+list.folder._id} >
                <ListItemText primary={list.season.name} secondary={list.folder.name}/>
            </ListItem> 
        )
    }
    render() {
        const { classes } = this.props;
        var nodes = [];
        for (var p of this.props.courses) {
            nodes.push(this.renderCourses(p))
            for (var c of p.courses) {
                nodes.push(this.renderCourse(c));
            }
            nodes.push(
                (<Divider key={'divider_'+p.season._id+p.folder._id}/>)
            )
        }

       
        return (
            <div className={classes.root}>
                 {nodes}
            </div>
        )
    };
};



CoursesTree.propTypes = {
    courses: PropTypes.array.isRequired,
    activeCourses: PropTypes.array.isRequired,
    activeHostCourses: PropTypes.array.isRequired,
    onActiveCourse: PropTypes.func.isRequired,
    onActiveHostCourse: PropTypes.func.isRequired
};


class CoursesDialog extends Component {

    constructor(props) {
        super(props);
        this.state = { activeCourses: [], activeHostCourses: []};
    }

    handleDialogEnter() {
        console.log("handleDialogEnter");
    }
    handleDialogExit() {
        console.log("handleDialogExit");
    }
    handleSaveAndClose(e) {
        console.log("handleSaveAndClose");
        var courses = [];
        for (var p of this.props.courses) {
            for (var c of p.courses) {
                courses.push(c);
            }
        }
        const ac = courses.filter((c)=>{return this.state.activeCourses.indexOf(c._id)!=-1});
        const ahc = courses.filter((c)=>{return this.state.activeHostCourses.indexOf(c._id)!=-1});
        this.props.onSave(ac,ahc);
        this.props.onRequestClose(e);
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
    
    render() {
        const { classes } = this.props;
        return (
            <Dialog
                fullScreen
                onEnter={()=>this.handleDialogEnter()}
                onExit={()=>this.handleDialogExit()}
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
                transition={<Slide direction="up" />}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                    <IconButton color="contrast" onClick={this.props.onRequestClose} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                    <Typography type="title" color="inherit" className={classes.flex}>
                        Courses
                    </Typography>
                    <Button color="contrast" onClick={(e)=>{this.handleSaveAndClose(e)}}>
                        save
                    </Button>
                    </Toolbar>
                </AppBar>
               
                <CoursesTree
                    classes={classes}
                    courses={this.props.courses}
                    activeCourses={this.state.activeCourses}
                    activeHostCourses={this.state.activeHostCourses}
                    onActiveCourse={(id,state)=>this.handleActiveCourse(id,state)}
                    onActiveHostCourse={(id,state)=>this.handleActiveHostCourse(id,state)}
                />
               


            </Dialog>
        )
    }

};


CoursesDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    courses: PropTypes.array.isRequired,
    activeCourses: PropTypes.array.isRequired,
    activeHostCourses: PropTypes.array.isRequired,
    onSave: PropTypes.func.isRequired
};

export default withStyles(styles)(CoursesDialog);