import React from "react";

const style = {};
export default function Caret(props) {
  return <span style={style} contentEditable="true" autoFocus={props.autoFocus || true}/>
}
