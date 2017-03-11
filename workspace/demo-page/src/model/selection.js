import {transformCursor} from "../../../dist/string-transform";

const DEFAULT_SELECTION = {
  anchor: 3,
  head: 10
};
export function selection(state = DEFAULT_SELECTION, action) {
  if (action.type === "CURSOR") {
    return {...state, anchor: action.value, head: action.value}
  } else if (action.type === "ANCHOR") {
    return {...state, anchor: action.value}
  } else if (action.type === "HEAD") {
    return {...state, head: action.value}
  } else if (action.op) {
    return transformCursor(state, action.op)
  }
  return state;
}
