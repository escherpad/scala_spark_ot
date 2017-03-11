import {applyOp} from "../../../dist/string-apply";

const DEFAULT_SOURCE = "Mary has a little lamb.\n";
export function source(state = DEFAULT_SOURCE, action) {
  if (action.type === "INPUT") {
    return applyOp(state, {...action, type: "ins"})
  } else if (action.type === "BACKSPACE") {
    return applyOp(state, {type: "del", pos: action.pos - 1, length: 1});
  } else if (action.type === "MOVE") {
    // notice: Cursor might lose focus.
    return applyOp(state, {...action, type: "mov"})
  }
  return state;
}
