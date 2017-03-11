import {applyOp} from "../../../dist/string-apply";

const DEFAULT_SOURCE = "Mary has a little lamb.\n";
export function source(state = DEFAULT_SOURCE, action) {
  if (action.op) {
    return applyOp(state, action.op);
  }
  return state;
}
