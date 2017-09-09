
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';




const HallInfo = createReactClass({

    propTypes: {
        male: PropTypes.number.isRequired, 
        female: PropTypes.number.isRequired 
    },

  
  

    render: function() {
        return (
            <div>  
                <FontAwesome name={"male"}/> {this.props.male} &nbsp;
                <FontAwesome name={"female"}/> {this.props.female}  &nbsp;
                &sum; {this.props.male+this.props.female}  &nbsp;
            </div>
        )
    }
});


export default HallInfo;