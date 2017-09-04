
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';




const HallInfo = createReactClass({

    propTypes: {
        male: PropTypes.number.isRequired, 
        female: PropTypes.number.isRequired 
    },

    getInitialState: function () {
        return {
          clock: new Date()
        };
    },
    componentDidMount: function () {
        this.clockInterval = setInterval(() => this.clockUpdate(), 200);
    },
    componentWillUnmount: function () {
        clearInterval(this.clockInterval);
    },

    clockUpdate: function() {
        this.setState({clock: new Date()});
    },

    render: function() {
        return (
            <div> HallInfo at {this.state.clock.toLocaleTimeString()} is 
                &sum;: {this.props.male+this.props.female} 
                <FontAwesome name={"male"}/>: {this.props.male} 
                <FontAwesome name={"female"}/>: {this.props.female}
            </div>
        )
    }
});


export default HallInfo;