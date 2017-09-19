import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import FontAwesome from 'react-fontawesome';
import { LinearProgress } from 'material-ui/Progress';
import decode_card from '../utils/Decode';
import {findRefGid,getCourse} from '../utils/Db';



const fakeCard1 = "TS*47707*eJyrViouLcpLzE1VslJQikosyEktScxR0lFQgol5JWaXJoEEilMTi/PzQEJGBoYG+oaGEMEKkEguiJ2cX1pUDNYDlipLLQKxQ4LBvMwUIMfE3NzAvBYAfNMeyA==*3370528772*1972071602**";
const fakeCard2 = "TS_CMD*eJyrVkrOLy0qTo3PTFGyUlBKTC+oSssLqvKJKMhIds+pSs7w9XFNj3JJMg6rTDYKjUz3dHa08I13qUpP91XSUYBpzkvMTQVpr4opNTBINczOSUzJAzNTFIpLgAxDU8vUlHwQw8wwOz+nOBssaalQkpiXChI1gClHMjM5PwVsphFIrCy1CMQOCTYE8SBudY4Pdg0JDVCqBQAw3T4N*685749921**";
const fakeCard3 = "TS_CMD*eJyrVipLLVKyUgoJNlTSUcpMATKd44NdQ0IDgNzk/NKi4tR4sGhiekFVWl5QlU9EQUaye05Vcoavj2t6lEuScVhlslFoZLqns6NRQKpLZnq+L0Jrcn5KKlCzIUIkLzEXJFIVU2pgkGqYnZOYkgdmpigUlwAZhqaWqSn5IIaZYXZ+TnE2WNJSoSQxLxUkagBTrlQLABFlPOY=*3846057001**";

class ScanLine extends Component {
    constructor(props) {
        super(props);
        this.state = {lastKey: 0, typing: false, value: "", focused:false, focusLost: 0};
        this.timerId = null;
    }

    componentDidMount() {
        this.clockInterval = setInterval(() => this.onTick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.clockInterval);
    }

    onTick() {
        const now = new Date();
        if (this.props.active && !this.state.focused && ((now - this.state.focusLost) > 5000)) {
            console.log("focus fix");
            this.inputNode.focus();
            const len = this.inputNode.value.length;
            this.inputNode.setSelectionRange(len, len);
        }
        if (this.state.typing && ((now - this.state.lastKey) > 2000)) {
            this.setState({typing:false});
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
          //console.log('Enter');
          const val = this.state.value;
          this.setState({value:"", typing:false});   
          this.processValue(val); 
        } else {
            this.setState({lastKey: new Date(), typing: true});
        }
    }
    
    onBlur() {
        this.setState({ focused: false, focusLost: new Date() })
    }
    onFocus() {
        this.setState({ focused: true })
    }
    
    onFakeCard(e,data) {
        this.setState({value:data, typing:true});
    }

    processValue(data) {
        console.log("processing input data",data)
        const dc = decode_card(data);
        if (dc === null) {
            this.props.onScanError("nelze přečíst kartu",data)
        } else { 
            switch(dc.action) {
                case 'TS':
                    findRefGid(dc.id, (st)=>{
                        this.props.onScanStudent(dc,st,data);
                    });
                break;
                case 'TS_CMD':
                    getCourse(dc.course_id, (c)=>{
                        this.props.onScanCmd(dc,c,data)
                    });
                break;
                default:
                this.props.onScanError("neznámá karta",data)    
            }
        }
       
    }


    render() {
        return (
            <div>   
                { this.state.typing && <LinearProgress />}
                <input 
                    ref={(input) => { this.inputNode = input; }} 
                    type='text' 
                    value={this.state.value} 
                    onChange={event => this.setState({ value: event.target.value })}
                    onKeyPress={event=> this.handleKeyPress(event)}
                    onBlur={()=>this.onBlur()}
                    onFocus={()=>this.onFocus()}
                />, 
                active: {this.props.active?"yes":"no"} typing: {this.state.typing? "yes":"no"} focus: {this.state.focused? "yes":"no"}
                <br/>
                <Button onClick={(e)=>this.onFakeCard(e,fakeCard1)}>TSCard_st</Button>
                <Button onClick={(e)=>this.onFakeCard(e,fakeCard2)}>TSCard_cmd</Button>
            </div>
        )
    };
}
ScanLine.propTypes = {
    active: PropTypes.bool.isRequired,
    onScanStudent: PropTypes.func.isRequired,
    onScanCmd: PropTypes.func.isRequired,
    onScanError: PropTypes.func.isRequired
};


export default ScanLine;