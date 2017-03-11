export function transformIndex(ind, op) {
  if (op.type === "ins") {
    return (op.pos <= ind ? op.value.length + ind : ind);
  } else if (op.type === "del") {
    return ind <= op.pos ? ind :
      ind <= op.pos + op.length ? op.pos :
        ind - op.length;
  }
  return ind;
}

export function transformCursor(cursor, op) {
  let anchor = transformIndex(cursor.anchor, op);
  let head = transformIndex(cursor.head, op);
  if (head !== cursor.head || anchor !== cursor.anchor) return {anchor, head};
  return cursor
}
