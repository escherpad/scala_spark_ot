import React from "react";

export default function Selection({reversed, color = "rgba(255, 0, 0, 0.4)", source, children}) {
  return <span className={reversed ? "Selection reversed" : "Selection"}
               style={{backgroundColor: color}}>{source || children}</span>
}
