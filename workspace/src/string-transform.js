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
  return cursor;
}

export function transform(op1, op2) {
  // todo: transform op2 after op1

  if (op1.type === "ins") {
    if (op2.type === "del") {
      return op2.pos + op2.length <= op1.pos ? [op2] :
        op2.pos <= op1.pos ? [
          {type : "del",
            pos : op2.pos,
            length : op1.value.pos - op2.pos},
            {type : "del",
              pos : op1.pos + op1.value.length - (op1.pos - op2.pos),
            length : op2.length - (op1.pos - op2.pos)}] :
          [{ type : "del",
          pos : op2.pos + op1.value.length,
          length : op2.length}];
    } else {
      console.log("WARNING: ot not implemented");
    }
  } else {
    console.log("WARNING: ot not implemented");
  }
  return ops;
}
