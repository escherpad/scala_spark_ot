import {Store, combineReducers} from "luna";
import {source} from "./source"
import {selection} from "./selection"

const rootReducer = combineReducers({
  source,
  selection
});

function opPreReducer (doc, action) {
  if (action.type === "INPUT") {
    action.op = {...action, type: "ins"}
  } else if (action.type === "BACKSPACE") {
    action.op = {type: "del", pos: action.pos - 1, length: 1};
  } else if (action.type === "MOVE") {
    // notice: Cursor might lose focus.
    action.op = {...action, type: "mov"};
  }
  return rootReducer(doc, action);
}

const store$ = new Store(opPreReducer);
export default store$;
