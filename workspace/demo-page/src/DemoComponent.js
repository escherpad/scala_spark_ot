/**
 * Created by ge on 3/7/17.
 */

import React, {Component, PropTypes} from "react";
import Selector from "./lib/Selector";
import Caret from "./components/Caret";

import "github-markdown-css";
class DemoComponent extends Component {
  static PropTypes = {
    selection: PropTypes.any,
    source: PropTypes.string,
  };

  render() {
    const props = this.props;
    const left = Math.min(props.selection.anchor, props.selection.head);
    const right = Math.max(props.selection.anchor, props.selection.head);
    return <article className="markdown-body">
      <h1>Operational Transform Demo</h1>
      <p>The &lt;pre&gt; block below shows the content of the source.</p>
      <pre>
        {props.source.slice(0, left)}
        {(left === right) ?
          <Caret/> :
          <highlight>{props.source.slice(left, right)}</highlight>
        }
        {props.source.slice(right)}
      </pre>
    </article>
  }
}

export default Selector((state) => {
  return state;
}, DemoComponent)
