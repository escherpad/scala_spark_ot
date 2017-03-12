import {makeOpDel, makeOpIns, makeOpMov} from "./utility";
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

function transform_ins_del(op0, op1) {
  return op1.pos + op1.length <= op0.pos ? [op1] :
    op1.pos <= op0.pos ? [
      makeOpDel(op1.pos, op0.value.pos - op1.pos),
      makeOpDel(op0.pos + op0.value.length - (op0.pos - op1.pos), op1.length - (op0.pos - op1.pos))
    ] :
    [makeOpDel(op1.pos + op0.value.length, op1.length)];
}

function transform_ins_ins(op0, op1) {
  return op1.pos + op1.length <= op0.pos ? [op1] :
    op1.pos <= op0.pos ? [
      makeOpIns(op1.pos, op0.value.pos - op1.pos),
      makeOpIns(op0.pos + op0.value.length - (op0.pos - op1.pos), op1.length - (op0.pos - op1.pos))
    ] :
    [makeOpIns(op1.pos + op0.value.length, op1.length)];
}

function transform_del_ins(op0, op1) {
  return op1.pos <= op0.pos ? [op1] :
    op1.pos <= op0.pos + op0.length ? [makeOpIns(op0.pos, op1.value)] :
    [makeOpIns(op1.pos - op0.length, op1.vlue)];
}

function transform_del_del(op0, op1) {
  return op1.pos <= op0.pos ? [op1] :
    op1.pos <= op0.pos + op0.length ? [makeOpDel(op0.pos, op1.value)] :
    [makeOpDel(op1.pos - op0.length, op1.vlue)];
}

export function transform(op0, op1) {
  // todo: transform op1 after op0

  if (op0.type === "ins") {
    if (op1.type === "del") {
      return transform_ins_del(op0, op1);
    } else if (op1.type === "ins"){
      return transform_ins_ins(op0, op1);
    } else if (op1.type === "mov") {
      // todo: ins then mov
      return nil;
    } else {
      console.log("Transform: no such operator!!!");
    };
  } else if (op0.type === "del") {
    if (op1.type === "ins") {
      return transform_del_ins(op0, op1);
    } else if (op1.type === "del") {
      return transform_del_del(op0, op1);
    } else if (op1.type === "mov") {
      // todo: del then mov
      return nil;
    } else {
      console.log("Transform: no such operator!!!");
    };
  } else {
    console.log("WARNING: ot not implemented");
  }
  return ops;
}
