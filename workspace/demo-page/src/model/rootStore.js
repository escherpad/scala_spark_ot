import {Store, combineReducers} from "luna";
import {source, DEFAULT_SOURCE} from "./source"
import {selection, DEFAULT_SELECTION} from "./selection"

const rootReducer = combineReducers({
  source,
  selection
});

function opPreReducer(state = {source: DEFAULT_SOURCE, selection: DEFAULT_SELECTION}, action) {
  let left, right, del_op, ops = [];
  left = Math.min(state.selection.anchor, state.selection.head);
  right = Math.max(state.selection.anchor, state.selection.head);
  del_op = {type: "del", pos: left, length: right - left};
  if (action.type === "INPUT") {
    if (del_op.length > 0) ops = [del_op];
    ops.push({type: "ins", pos: left, value: action.value});
  } else if (action.type === "BACKSPACE") {
    if (del_op.length > 0) ops = [del_op];
    else ops = [{type: "del", pos: state.selection.anchor - 1, length: 1}];
  } else if (action.type === "ENTER") {
    if (del_op.length > 0) ops = [del_op];
    else ops = [{type: "ins", pos: left, value: "\n"}];
  } else if (action.type === "MOVE") {
    if (del_op.length > 0) ops = [del_op];
    // notice: Cursor might lose focus.
    ops.push({type: "mov"});
  }
  if (ops.length > 0) {
    return ops.map((op) => ({...action, op})).reduce(rootReducer, state);
  }
  return rootReducer(state, action);
}

const store$ = new Store(opPreReducer);

store$.update$.subscribe((update) => console.log(update));
export default store$;
