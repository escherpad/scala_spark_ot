/**
 * Created by ge on 3/11/17.
 */
export function transformIndex(ind, op) {
  if (op.type === "ins") {
    return (op.pos < ind ? op.len + ind : ind);
  } else if (op.type === "del") {
    return (op.pos < ind ? ind - op.len : ind);
  }
  return ind;
}

export function transformCursor(cursor, op) {
  if (op.type === "insert") {
    let anchor = transformIndex(cursor.anchor, op);
    let head = transformIndex(cursor.anchor, op);
    if (anchor_ !== cursor.anchor || head_ !== cursor.head) {
      return {anchor, head};
    }
    return cursor;
  }

}
