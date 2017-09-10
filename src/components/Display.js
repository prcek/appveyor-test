import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import FontAwesome from 'react-fontawesome';

class Message extends Component {
    render() {
            return (
                <span> message {this.props.text} {this.props.show ? "yes":"no"} </span>
            )
    };
}

Message.propTypes = {
    show: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
};


class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {lastUpdate: 0, messageShow: true};
        this.timerId = null;
    }


    componentWillReceiveProps(nextProps) {
        console.log("new props");
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.setState({messageShow:true, lastUpdate: new Date()});
        this.timerId=setTimeout(()=>{
            this.setState({messageShow:false});
        }, this.props.messageHideTimeout);
    }

    render() {
        return (
            <div>
                <Typography type="display4" align="center"> 
                    <FontAwesome name={"shower"}/> <FontAwesome name={"qrcode"}/> 
                </Typography>
                <Typography type="display2" align="center"> 
                    jmeno
                </Typography>
            </div>
        )
    };
}

/*
    set_icon("fa-male","white");
    set_icon("fa-female","black");
    set_icon("fa-thumbs-o-up","white");
    set_icon("fa-trash-o","white");
    set_icon("fa-exclamation-triangle","white");
    set_icon("fa-users","white");
    set_icon("fa-wrench","white");
*/

Display.defaultProps = {
    messageHideTimeout: 2000
};

Display.propTypes = {
    activeScan: PropTypes.bool,
    message: PropTypes.string,
    messageHideTimeout: PropTypes.number.isRequired
};


export default Display;