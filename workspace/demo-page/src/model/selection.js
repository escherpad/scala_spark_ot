const DEFAULT_SELECTION = {
  anchor: 3,
  head: 10
};
export function selection(state = DEFAULT_SELECTION, action) {
  if (action.type === "CARET") {
    return {...state, anchor: action.value, head: action.value}
  } else if (action.type === "ANCHOR") {
    return {...state, anchor: action.value}
  } else if (action.type === "HEAD") {
    return {...state, head: action.value}
  }
  return state;
}
