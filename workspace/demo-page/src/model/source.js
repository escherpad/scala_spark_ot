import {ins, del, mov} from "../../../dist/string-ops";

const DEFAULT_SOURCE = "Mary has a little lamb.\n";
export function source(state = DEFAULT_SOURCE, action) {
  if (action.type === "INPUT") {
    return ins(state, action.pos, action.value)
  } else if (action.type === "BACKSPACE") {
    return del(state, action.pos - 1, 1)
  } else if (action.type === "MOVE") {
    // notice: Cursor might lose focus.
    return mov(state, action.pos, action.length, action.des)
  }
  return state;
}
