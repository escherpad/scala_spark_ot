import {Store, combineReducers} from "luna";
import {source} from "./source"
import {selection} from "./selection"

const rootReducer = combineReducers({
  source,
  selection
});

const store$ = new Store(rootReducer);
export default store$;
