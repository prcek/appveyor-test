import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
var moment = require('moment');
moment.locale('cs');

const styles  = theme => ({ 
    red: {
      color: 'red'
    },
    green: {
        color: 'green'
      },
  });


class SyncPanel extends Component {
    render() {
        const classes = this.props.classes;
        return (
            <Typography>
                verze dat: {moment(this.props.lastSync).format('LLLL')}
                <br/>
                <FontAwesome className={(this.props.apiReady)?classes.green:classes.red} name="wifi"/>
                
                
                { (this.props.activeSync) && 
                    <FontAwesome spin={true} className="text-danger" name="cog"/>
                }
                { (this.props.syncOk === false) && 
                    <FontAwesome className="text-danger" name="exclamation-triangle"/>
                }
                { (this.props.syncOk === true) && 
                    <FontAwesome className="text-danger" name="check"/>
                }
               
            </Typography>
        )
    };
}


SyncPanel.propTypes = {
    activeSync: PropTypes.bool.isRequired,
    syncOk: PropTypes.bool,
    apiReady: PropTypes.bool
};

export default withStyles(styles)(SyncPanel);
