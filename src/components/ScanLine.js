import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import FontAwesome from 'react-fontawesome';



class ScanLine extends Component {
    constructor(props) {
        super(props);
        this.state = {lastUpdate: 0, typing: false, value: ""};
        this.timerId = null;
    }

    componentDidMount() {
        this.clockInterval = setInterval(() => this.onTick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.clockInterval);
    }

    onTick() {
        if (this.props.active && !this.state.focused) {
            console.log("focus fix");
            this.inputNode.focus();
            const len = this.inputNode.value.length;
            this.inputNode.setSelectionRange(len, len);
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
          console.log('Enter');
          this.setState({value:""});
        //} else {
        //  console.log("Key")
        }
    }
    
    onBlur() {
        this.setState({ focused: false })
    }
    onFocus() {
        this.setState({ focused: true })
    }
    

    render() {
        return (
            <div>   
                <input 
                    ref={(input) => { this.inputNode = input; }} 
                    type='text' 
                    value={this.state.value} 
                    onChange={event => this.setState({ value: event.target.value })}
                    onKeyPress={event=> this.handleKeyPress(event)}
                    onBlur={()=>this.onBlur()}
                    onFocus={()=>this.onFocus()}
                />, 
                active: {this.props.active?"yes":"no"} typing: {this.state.typing? "yes":"no"} focus: {this.state.focused? "yes":"no"} value: {this.state.value}
            </div>
        )
    };
}
ScanLine.propTypes = {
    active: PropTypes.bool.isRequired,
};


export default ScanLine;