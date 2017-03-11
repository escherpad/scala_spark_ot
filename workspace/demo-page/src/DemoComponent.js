/**
 * Created by ge on 3/7/17.
 */

import React, {Component, PropTypes} from "react";
import Selector from "./lib/Selector";
import Caret from "./components/Caret";
import InputBlock from "./components/InputBlock";
import Selection from "./components/Selection";

import {ins} from "../../dist/ops/string-ops";

import "github-markdown-css";
class DemoComponent extends Component {
  static PropTypes = {
    source: PropTypes.string,
    selection: PropTypes.any
  };

  render() {
    const props = this.props;
    const left = Math.min(props.selection.anchor, props.selection.head);
    const right = Math.max(props.selection.anchor, props.selection.head);
    const reversed = (props.selection.anchor >= props.selection.head);
    return <article className="markdown-body">
      <h1>Operational Transform Demo</h1>
      <p>The &lt;pre&gt; block below shows the content of the source.</p>
      <pre>{
        props.source.slice(0, left)
      }{
        reversed ?
          [<InputBlock/>, <Caret/>, <Selection>{props.source.slice(left, right)}</Selection>] :
          [<Selection>{props.source.slice(left, right)}</Selection>, <InputBlock/>, <Caret/>]
      }{props.source.slice(right)
      }</pre>
      <div>
        <label htmlFor="anchor"><code>selection.anchor</code></label>
        <input name="anchor" type="number"
               value={this.props.selection.anchor}
               onChange={(e) => this.props.dispatch({type: "ANCHOR", value: Number(e.target.value)})}/>
      </div>
      <div>
        <label htmlFor="anchor"><code>selection.head</code></label>
        <input type="number"
               value={this.props.selection.head}
               onChange={(e) => this.props.dispatch({type: "HEAD", value: Number(e.target.value)})}/>
      </div>
      <button onClick={() => alert(ins('hahaha', 0, 'google'))}>test</button>
    </article>
  }
}

export default Selector((state) => {
  return state;
}, DemoComponent)
