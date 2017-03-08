import {Store} from "luna";

const DEFAULT_STATE = {
  source: "Marry has a little lamb.\n",
  selection: {
    anchor: 3,
    head: 3
  }
};
function rootReducer(state = DEFAULT_STATE, action) {
  return state;
}

const store$ = new Store(rootReducer);
export default store$;
