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
            <Grid container align={'center'} justify={'center'} style={{height: "100%"}}>
                <Grid item style={{height:"100%", width: "100%", backgroundColor:"white" }}>
                    <div style={{ height:"100%", backgroundColor:"black"}}></div>
                </Grid >
            </Grid>
        )
    }
 
    renderMsg() {
        var icon_name = "bug";
        var icon_color = "gray";
        var bcolor = "black";
        switch(this.props.message_type) {
            case "error": icon_name = "warning"; icon_color="white"; bcolor="red"; break;
            case "setup": icon_name = "wrench"; icon_color="white"; bcolor="black"; break;
            case "init":  icon_name = "thumbs-o-up"; icon_color="white"; bcolor="black"; break;
            case "ok":  icon_name = "thumbs-o-up"; icon_color="white"; bcolor="green"; break;
            case "ok-male":  icon_name = "male"; icon_color="white"; bcolor="green"; break;
            case "ok-female":  icon_name = "female"; icon_color="white"; bcolor="green"; break;
            case "in":  icon_name = "thumbs-o-up"; icon_color="white"; bcolor="blue"; break;
            case "out":  icon_name = "thumbs-o-up"; icon_color="white"; bcolor="blue"; break;
            case "idle":  icon_name = "search"; icon_color="gray"; bcolor="#151515"; break;
            case "manual": icon_name = "search"; icon_color="blue"; break;
        }
        return (
            <Grid container align={'center'} justify={'center'} style={{height: "100%", backgroundColor: bcolor}}>
                <Grid item>
                    <Typography type="display4" align="center"> 
                        <FontAwesome name={icon_name} style={{color:icon_color}}/>
                    </Typography>
                    <Typography type="display2" align="center" style={{color:icon_color}}> 
                        {this.props.message}
                    </Typography>
                    <Typography type="display1" align="center" style={{color:icon_color}}> 
                        {this.props.message_desc}
                    </Typography>
                </Grid >
            </Grid>

        )
    };

    render() {
        return this.props.flash ? this.renderFlash(): this.renderMsg();
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