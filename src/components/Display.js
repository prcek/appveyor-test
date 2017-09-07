import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';

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
                display, 
                activeScan:  {this.props.activeScan? 'true':'false'}, 
                <Message text={this.props.message} show={this.state.messageShow} />
                lastUpdate: {this.state.lastUpdate? this.state.lastUpdate.toLocaleTimeString():'undef'}
            </div>
        )
    };
}



Display.defaultProps = {
    messageHideTimeout: 2000
};

Display.propTypes = {
    activeScan: PropTypes.bool,
    message: PropTypes.string,
    messageHideTimeout: PropTypes.number.isRequired
};


export default Display;