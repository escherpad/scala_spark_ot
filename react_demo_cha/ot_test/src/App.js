/* Import the React library from the installed 'react' NPM module*/
import React from 'react';

/* fetch the style sheet*/
import './App.css'

/* App function starts here*/
const App = () => {
    return (<div className="App">Hello World!</div>)
}

/* In order to give other files a chance to take advantage of code
   written in this file, we need to export. (Otherwise, nothing will
   display on the screen :) )*/
export default App;
