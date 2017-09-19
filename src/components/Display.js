import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import FontAwesome from 'react-fontawesome';


class Display extends Component {
    constructor(props) {
        super(props);
    }

    renderFlash() {
        return (
            <div>
                <Typography type="display4" align="center"> 
                    <FontAwesome name="bullseye" style={{color:"white"}}/>
                </Typography>
            </div>
        )
    }
 
    renderMsg() {
        var icon_name = "bug";
        var icon_color = "gray";
        switch(this.props.message_type) {
            case "error": icon_name = "warning"; icon_color="red"; break;
            case "setup": icon_name = "wrench"; icon_color="white"; break;
            case "init":  icon_name = "thumbs-o-up"; icon_color="white"; break;
        }
        return (
            <div>
                { this.props.flash && <p style={{color:"red"}}> active </p>}
                <Typography type="display4" align="center"> 
                    <FontAwesome name={icon_name} style={{color:icon_color}}/>
                </Typography>
                <Typography type="display2" align="center"> 
                    {this.props.message}
                </Typography>
            </div>
        )
    };

    render() {
        if (this.props.flash) {
            return this.renderFlash();
        } else {
            return this.renderMsg();
        }
    }
        
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
    flash: PropTypes.bool,
    message: PropTypes.string,
    message_type: PropTypes.string,
};


export default Display;