
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';




const Clock = createReactClass({


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
            <div> {this.state.clock.toLocaleTimeString()} </div>
        )
    }
});


export default Clock;