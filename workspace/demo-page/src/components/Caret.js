import React from "react";

const style = {
  position: "relative",
  display: "inline-block",
  width: "5px",
  marginRight: "-5px",
  backgroundColor: "rgba(255, 0, 0, 0.6)",
  height: "20px",
  top: "5px",
  marginTop: "calc(1em - 20px)"
};
export default function Caret() {
  return <span style={style}/>
}
