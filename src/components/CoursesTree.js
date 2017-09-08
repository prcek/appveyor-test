

import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import { withStyles } from 'material-ui/styles';

import FontAwesome from 'react-fontawesome';

const styles  = theme => ({ 
    root: {
       // display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'scroll',
        background: theme.palette.background.paper,
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
            <div>
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


export default withStyles(styles)(CoursesTree);