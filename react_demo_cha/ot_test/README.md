# Learning Note For React
The setup procedure for the modern front-end development is too complicated, However, thanks to the create-react-app project, we can setup a well organized react project in a seconds. (I feel it is quite similar to the ruby on rail :) ). Hence, my learning note is based on the create-react-app setup.

## Project Structure
I am not familiar with the front-end techniques, However, The react project structure looks quite similar to a traditional compile and run project. (May be ios :)). I am quite interesting in that may be react can even compile our code into the webAssemble?
- package.json: dependencies, version, name, etc.
- node_modules: dependency files 
- **src**: modifiable code
  - index.js: main Render Call from ReactDOM (like the main function in c, and java)
  - index.css: the base styling for application
  - App.js: a demo app js (Maybe deleted)
  - App.css: the styling for the App
  - App.test.js: the for the App.js

## Concepts
- ES2015: ECMAScript 2015 is an ECMAScript standard that was ratified in June 2015. (Seems to be the standard javascript used)
- JSX: A Preprocessor step that adds XML syntax to JavaScript.

## How to create components in React?
1. Functions
2. ES2015 Classes

## Build the App
### Add the js file
```javascript
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
```
### Add the style sheet (css)
```css
/* add the css for the App component */
.App {
    border: 2px solid black;
    text-align: center;
    background: #8a1e8a;
    color: #333;
    margin: 20px;
    padding: 20px;
}
```

## Reference

- [Learning React With Create-React-App](https://medium.com/@diamondgfx/learning-react-with-create-react-app-part-1-a12e1833fdc#.u3deyvf5e)
