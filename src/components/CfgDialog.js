
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import { withStyles } from 'material-ui/styles';

import Cfg from '../utils/Cfg';


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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
});


class CfgDialog extends Component {

    constructor(props) {
        super(props);
        this.cfg = new Cfg();
        this.state = { remote_api_url: "", remote_api_secret: "",station_name:"",full_screen:false, startup_sync:false, debug:false};
    }

    handleDialogEnter() {
        //console.log("handleDialogEnter");
        this.setState({
            remote_api_url: this.cfg.remote_api_url, 
            remote_api_secret: this.cfg.remote_api_secret, 
            full_screen: this.cfg.full_screen,
            startup_sync: this.cfg.startup_sync,
            station_name: this.cfg.station_name,
            debug: this.cfg.debug
        });
    }
    handleDialogExit() {
        //console.log("handleDialogExit");
    }
    handleSaveAndClose(e) {
        //console.log("handleSaveAndClose");
        this.cfg.remote_api_secret = this.state.remote_api_secret;
        this.cfg.remote_api_url = this.state.remote_api_url;
        this.cfg.station_name = this.state.station_name;
        this.cfg.full_screen = this.state.full_screen;
        this.cfg.startup_sync = this.state.startup_sync;
        this.cfg.debug = this.state.debug;
        this.props.onRequestClose(e);
    }
    componentDidMount() {
        //console.log("CfgDialog DidMount")
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
                        Configuration
                    </Typography>
                    <Button color="contrast" onClick={(e)=>{this.handleSaveAndClose(e)}}>
                        save
                    </Button>
                    </Toolbar>
                </AppBar>
                <form className={classes.container} noValidate>
                    <TextField
                        id="remote_api_url"
                        label="Remote API Url"
                        className={classes.textField}
                        value={this.state.remote_api_url}
                        onChange={event => this.setState({ remote_api_url: event.target.value })}
                        margin="normal"
                    />
                    <TextField
                        id="remote_api_secret"
                        label="Remote API Secret"
                        className={classes.textField}
                        value={this.state.remote_api_secret}
                        onChange={event => this.setState({ remote_api_secret: event.target.value })}
                        margin="normal"
                    />

                    <TextField
                        id="station_name"
                        label="Station Name"
                        className={classes.textField}
                        value={this.state.station_name}
                        onChange={event => this.setState({ station_name: event.target.value })}
                        margin="normal"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.full_screen}
                                onChange={(event, checked) => this.setState({ full_screen: checked })}
                            />
                        }
                        label="Auto FullScreen"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.startup_sync}
                                onChange={(event, checked) => this.setState({ startup_sync: checked })}
                            />
                        }
                        label="Auto startup sync"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.debug}
                                onChange={(event, checked) => this.setState({ debug: checked })}
                            />
                        }
                        label="Debug"
                    />

                </form>
            </Dialog>
    );
  }
}

CfgDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};


export default withStyles(styles)(CfgDialog);
