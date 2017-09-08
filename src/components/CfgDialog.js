
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
import { withStyles, createStyleSheet } from 'material-ui/styles';

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
        this.state = { remote_api_url: "", remote_api_secret: ""};
    }

    handleDialogEnter() {
        //console.log("handleDialogEnter");
        this.setState({remote_api_url: this.cfg.remote_api_url, remote_api_secret: this.cfg.remote_api_secret});
    }
    handleDialogExit() {
        //console.log("handleDialogExit");
    }
    handleSaveAndClose(e) {
        //console.log("handleSaveAndClose");
        this.cfg.remote_api_secret = this.state.remote_api_secret;
        this.cfg.remote_api_url = this.state.remote_api_url;
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
