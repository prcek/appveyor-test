import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import FontAwesome from 'react-fontawesome';
import { LinearProgress } from 'material-ui/Progress';
import decode_card from '../utils/Decode';
import {findRefGid,getCourse, reportRawScan} from '../utils/Db';



const fakeCard1 = "TS*47707*eJyrViouLcpLzE1VslJQikosyEktScxR0lFQgol5JWaXJoEEilMTi/PzQEJGBoYG+oaGEMEKkEguiJ2cX1pUDNYDlipLLQKxQ4LBvMwUIMfE3NzAvBYAfNMeyA==*3370528772*1972071602**";
const fakeCard2 = "TS_CMD*eJyrVkrOLy0qTo3PTFGyUlBKTC+oSssLqvKJKMhIds+pSs7w9XFNj3JJMg6rTDYKjUz3dHa08I13qUpP91XSUYBpzkvMTQVpr4opNTBINczOSUzJAzNTFIpLgAxDU8vUlHwQw8wwOz+nOBssaalQkpiXChI1gClHMjM5PwVsphFIrCy1CMQOCTYE8SBudY4Pdg0JDVCqBQAw3T4N*685749921**";
const fakeCard3 = "TS_CMD*eJyrVipLLVKyUgoJNlTSUcpMATKd44NdQ0IDgNzk/NKi4tR4sGhiekFVWl5QlU9EQUaye05Vcoavj2t6lEuScVhlslFoZLqns6NRQKpLZnq+L0Jrcn5KKlCzIUIkLzEXJFIVU2pgkGqYnZOYkgdmpigUlwAZhqaWqSn5IIaZYXZ+TnE2WNJSoSQxLxUkagBTrlQLABFlPOY=*3846057001**";
const fakeCard4 = "TS_CMD*eJyrVipLLVKyUgoJNlTSUcpMATKd44NdQ0ID4t19gSLJ+aVFxanxYInE9IKqtLygKp+Igoxk95yq5AxfH9f0KJck47DKZKPQyHRPZ0ejgFSXzPR8JK3J+SmpQM2GCJG8xFyQSFVMqYFBqmF2TmJKHpiZolBcAmQYmlqmpuSDGGaG2fk5xdlgSUuFksS8VJCoAUy5Ui0Awb092Q==*3427684786**";
const fakeCard5 = "TS_CMD*eJyrVipLLVKyUgoJNlTSUcpMATKd4x1dXICc5PzSouLUeLBYYnpBVVpeUJVPREFGsntOVXKGr49repRLknFYZbJRaGS6p7OjUUCqS2Z6vi9Ca3J+SipQsyFCJC8xFyRSFVNqYJBqmJ2TmJIHZqYoFJcAGYamlqkp+SCGmWF2fk5xNljSUqEkMS8VJGoAU65UCwCFODwe*2616170447**";
const fakeCard6 = "TS_CMD*eJyrVipLLVKyUgoJNlTSUcpMATKd4x1dXOJ9gdzk/NKi4tR4sGhiekFVWl5QlU9EQUaye05Vcoavj2t6lEuScVhlslFoZLqns6NRQKpLZno+ktbk/JRUoGZDhEheYi5IpCqm1MAg1TA7JzElD8xMUSguATIMTS1TU/JBDDPD7Pyc4mywpKVCSWJeKkjUAKZcqRYA/z08yg==*377203085**";
const fakeCard7 = "TS_CMD*eJyrVipLLVKyUgoJNlTSUcpMATKd4x1dXOLdgNzk/NKi4tR4sGhiekFVWl5QlU9EQUaye05Vcoavj2t6lEuScVhlslFoZLqns6NRQKpLZnq+L0Jrcn5KKlCzIUIkLzEXJFIVU2pgkGqYnZOYkgdmpigUlwAZhqaWqSn5IIaZYXZ+TnE2WNJSoSQxLxUkagBTrlQLAPrPPMM=*4290452104**";
const fakeCard8 = "TS*71581*eJyrVipLLVKyUgoJNlTSUcpMUbIyNzS1MNRRKk5NLM7PA8oYGRia6xtaAGWT80uLilOBQiCleYm5IGZIfm5MqYFBqiGQNDQDSRSXFkHlnEqzyxJzUkBiqRVAfq5SLQCgwh9i*511121617*89993390**";
const fakeCard9 = "TS*72210*eJyrVipLLVKyUgoJNlTSUcpMUbIyNzIyNNBRKk5NLM7PA8oYGRia6xtaAGWT80uLilOBQiCleYm5IKZXaU5mKpBbXFoEFQmLKTUwSE0pyc4vA7NAiotTK4AyaUq1ALKwH8w=*1471044403*2247658100**";


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
            //console.log("focus fix");
            this.inputNode.focus();
            const len = this.inputNode.value.length;
            this.inputNode.setSelectionRange(len, len);
        }
        if (this.state.typing && ((now - this.state.lastKey) > 2000)) {
            this.setState({typing:false});
        }

    }

    handleValue(val) {
        this.setState({ value: val })
        if (val.match(/^[0-9]+/)) {
            this.props.onScanManual(val);
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
        let dc = null;
        if (data.match(/^[0-9]+$/)) {
            console.log("DIRECT INPUT");
            dc = { action: "TS", id: Number(data)};
            reportRawScan("manual",data);
        } else {
            dc = decode_card(data);
            if (dc !== null) {
                reportRawScan("decode_ok",data);  
            }
        }

        if (dc === null) {
            this.props.onScanError("nelze přečíst kartu",data)
            reportRawScan("decode_error",data);
        } else { 
            switch(dc.action) {
                case 'TS':
                    findRefGid(dc.id, (st)=>{
                        if (st === null) {
                            this.props.onScanStudent(dc,null,null,data);
                        } else {
                            getCourse(st.course_key,(course)=>{
                                this.props.onScanStudent(dc,st,course,data);
                            })       
                        }
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

    renderDebug() {
        return (
            <div>
                <Typography>
                    active: {this.props.active?"yes":"no"} typing: {this.state.typing? "yes":"no"} focus: {this.state.focused? "yes":"no"}
                </Typography>
                <Button onClick={(e)=>this.onFakeCard(e,fakeCard8)}>TSCard_st</Button>
                <Button onClick={(e)=>this.onFakeCard(e,fakeCard7)}>TSCard_cmd</Button>
            </div>
        )
    }

    render() {
        const dbg = this.renderDebug();
        
        return (
            <div>   
                { this.state.typing && <LinearProgress />}
                <input 
                    ref={(input) => { this.inputNode = input; }} 
                    type='text' 
                    value={this.state.value} 
                    onChange={event => this.handleValue(event.target.value)}
                    onKeyPress={event=> this.handleKeyPress(event)}
                    onBlur={()=>this.onBlur()}
                    onFocus={()=>this.onFocus()}
                    style={this.props.debug? {width:'100%'}:{color:"black", background: "black", border: "0px", height:'1px', width:'1px', outline: "none"}}
                />, 
                {this.props.debug && dbg}
            </div>
        )
    };
}
ScanLine.propTypes = {
    active: PropTypes.bool.isRequired,
    onScanStudent: PropTypes.func.isRequired,
    onScanCmd: PropTypes.func.isRequired,
    onScanError: PropTypes.func.isRequired,
    onScanManual: PropTypes.func.isRequired
};


export default ScanLine;