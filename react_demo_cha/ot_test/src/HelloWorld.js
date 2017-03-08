import React from 'react';
import './HelloWorld.css';

// use a parameter
const HelloWorld = (props) => {
    return (<div className="HelloWorld">Hello {props.name}!</div>);
};

export default HelloWorld;
