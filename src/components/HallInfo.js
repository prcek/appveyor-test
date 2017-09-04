
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
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
            <div> HallInfo at {this.state.clock.toLocaleTimeString()} is total: {this.props.male+this.props.female} male: {this.props.male} female: {this.props.female}</div>
        )
    }
});


export default HallInfo;