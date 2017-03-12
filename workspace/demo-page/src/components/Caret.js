import React from "react";
import "./Caret.css";

const style = {
  position: "relative",
  display: "inline-block",
  width: "5px",
  margin: "-0.5em -5px -0.5em 0",
  padding: "0.5em 0 0.5em 0",
  boxSizing: "border-box",
  backgroundColor: "rgba(255, 0, 0, 0.6)",
  height: "0",
  verticalAlign: "middle"
};
export default function Caret() {
  return <span className="Caret-blinking" style={style}/>
}
