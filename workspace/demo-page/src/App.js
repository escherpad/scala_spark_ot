import React, {Component} from 'react';
import rootStore$ from "./model/rootStore";
import DemoComponent from "./DemoComponent";

import './App.css';
export default class App extends Component {
  render() {
    return (
      <div className="App">
        <DemoComponent store={rootStore$} dispatch={rootStore$.dispatch}/>
      </div>
    );
  }
}

