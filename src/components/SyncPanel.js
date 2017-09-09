import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

class SyncPanel extends Component {
    render() {
        return (
            <span>
                DB Sync:
                <FontAwesome spin={this.props.activeSync} className="text-danger" name="cog"/>
                { (this.props.syncOk === false) && 
                    <FontAwesome className="text-danger" name="exclamation-triangle"/>
                }
                { (this.props.apiReady === true) && 
                    <FontAwesome className="text-danger" name="wifi"/>
                }
                { (this.props.syncOk === true) && 
                    <FontAwesome className="text-danger" name="check"/>
                }
            </span>
        )
    };
}


SyncPanel.propTypes = {
    activeSync: PropTypes.bool.isRequired,
    syncOk: PropTypes.bool,
    apiReady: PropTypes.bool
};


export default SyncPanel;