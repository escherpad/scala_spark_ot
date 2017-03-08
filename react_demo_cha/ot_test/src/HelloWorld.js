import './HelloWorld.css';

// support the class
import React, { Component } from 'react';

// use the class
class HelloWorld extends Component {
    // we need an constructor here
    constructor(props) {
        /* the super class will save every thing in props*/
        super(props);

        /* we can write the state like this*/
        this.state = { greeting : 'Hello ' };

        /* set the this point for the frechify function*/
        this.frechify = this.frechify.bind(this);
    };

    /* the frechify function*/
    frechify() {
        this.setState({ greeting : 'Bonjour' });
    }

    render() {
        return (
            <div className="HelloWorld">
               {this.state.greeting} {this.props.name}!
                {/* add the button */}
                <br/>
                <button onClick={this.frechify} >Frenchify!</button>
            </div>
        );
    };
}


export default HelloWorld;
