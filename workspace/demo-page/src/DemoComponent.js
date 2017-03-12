/**
 * Created by ge on 3/7/17.
 */

import React, {Component, PropTypes} from "react";
import Selector from "./lib/Selector";
import Caret from "./components/Caret";
import InputBlock from "./components/InputBlock";
import Selection from "./components/Selection";

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
    const isReversed = (props.selection.anchor >= props.selection.head);
    return <article className="markdown-body">
      <h1>Operational Transform Demo</h1>
      <p>The &lt;pre&gt; block below shows the content of the source.</p>
      <pre>{
        props.source.slice(0, left)
      }{
        isReversed ?
          [<InputBlock key="input-block"
                       focus="true"
                       onChange={(command, value, op) => props.dispatch({type: command, value})}
          />, <Caret key="caret"/>, <Selection key="selection">{props.source.slice(left, right)}</Selection>] :
          [<Selection key="selection">{props.source.slice(left, right)}</Selection>, <InputBlock
            key="input-block"
            focus="true"
            onChange={(command, value, op) => props.dispatch({type: command, value})}/>, <Caret key="caret"/>]
      }{props.source.slice(right)
      }</pre>
      <div>
        <label htmlFor="cursor"><code>selection</code></label>
        <input name="cursor" type="number"
               value={props.selection.head}
               onChange={(e) => props.dispatch({type: "CURSOR", value: Number(e.target.value)})}/>
      </div>
      <div>
        <label htmlFor="anchor"><code>selection.anchor</code></label>
        <input name="anchor" type="number"
               value={props.selection.anchor}
               onChange={(e) => props.dispatch({type: "ANCHOR", value: Number(e.target.value)})}/>
      </div>
      <div>
        <label htmlFor="anchor"><code>selection.head</code></label>
        <input type="number"
               value={props.selection.head}
               onChange={(e) => props.dispatch({type: "HEAD", value: Number(e.target.value)})}/>
      </div>
      <div>
        <label htmlFor="anchor"><code>input</code></label>
        <input type="text"
               onChange={(e) => this.isComposing || props.dispatch({
                 type: "INPUT",
                 value: e.target.value
               }) || (e.target.value = '')}
               onCompositionStart={(e) => this.isComposing = true}
               onCompositionEnd={(e) => (this.isComposing = false) ||
               props.dispatch({type: "INPUT", value: e.target.value}) ||
               (e.target.value = '')}
        />&nbsp;
        <kbd onClick={() => props.dispatch({type: "BACKSPACE"})}>backspace</kbd>
      </div>
    </article>
  }
}

export default Selector((state) => {
  return state;
}, DemoComponent)
