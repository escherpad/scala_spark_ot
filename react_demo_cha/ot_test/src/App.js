/* Import the react first*/
import React from 'react';

/* import the hello world app module*/
import HelloWorld from './HelloWorld';

const App = () => {
    return (
        <div className="App">
            {/* use hello world app */}
            <HelloWorld name="foo"/>
            {/* build the second hello world app */}
            <HelloWorld name="bar"/>
        </div>
    );
};

/* export for other file to use our code*/
export default App;
