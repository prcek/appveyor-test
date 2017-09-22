
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';




const HallInfo = createReactClass({

    propTypes: {
        students: PropTypes.array.isRequired
    },

    render: function() {
        const s = this.props.students.reduce((sum,value)=>{
            switch (value.sex) {
                case "m": return [sum[0]+1,sum[1],sum[2]+1];
                case "f": return [sum[0],sum[1]+1,sum[2]+1];
                default: [sum[0],sum[1],sum[2]+1];
            }
        },[0,0,0]);
        return (
            <div>  
                <FontAwesome name={"male"}/> {s[0]} &nbsp;
                <FontAwesome name={"female"}/> {s[1]}  &nbsp;
                &sum; {s[2]}  &nbsp;
            </div>
        )
    }
});


export default HallInfo;