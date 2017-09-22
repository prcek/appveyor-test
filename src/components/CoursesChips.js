


import React, { Component } from 'react';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontAwesome from 'react-fontawesome';

import { withStyles } from 'material-ui/styles';

const styles  = theme => ({ 

    chip: {
        margin: theme.spacing.unit,
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    }

});


class CoursesChips extends Component {
   
    constructor(props) {
        super(props);
    }

    renderChip(c) {
        const classes = this.props.classes;
        return (
            <Chip key={c._id} label={c.code} className={classes.chip} 
                //avatar={<Avatar>{c.code}</Avatar>}
            />   
        )
    }
    render() {
        const classes = this.props.classes;
        const chips = this.props.courses.map((c=>this.renderChip(c)));
        return (
            <div className={classes.row}>
              { chips }
            </div>
        )
    };
};



//export default CoursesChips;

CoursesChips.propTypes = {
    classes: PropTypes.object.isRequired,
    courses: PropTypes.array.isRequired
};

export default withStyles(styles)(CoursesChips);
//export default CoursesChips;