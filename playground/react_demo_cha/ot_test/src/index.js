import React from 'react';
import ReactDOM from 'react-dom';

/* ./ means App is a local library not coming from NPM*/
import App from './App';
import './index.css';

/* render function tells React precisely HOW to throw a
   component into your browser*/
ReactDOM.render(
  <App />, // Which Component to render (App)
  document.getElementById('root') // Where to render that component (root)
);
