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
    [makeOpIns(op1.pos - op0.length, op1.value)];
}

function transform_del_del(op0, op1) {
  return op1.pos <= op0.pos ? [op1] :
    op1.pos <= op0.pos + op0.length ? [makeOpDel(op0.pos, op1.value)] :
    [makeOpDel(op1.pos - op0.length, op1.value)];
}

function transform_del_mov(op0, op1) {
  // case 0: destination of Mov located before deletion area
  if((op1.pos+op1.length<=op0.pos && op1.des <= op0.pos)||(op1.pos >= op0.pos+op0.length && (op1.des >= op0.pos+op0.length || op1.des <= op0.pos))){
    return op1;
  }

  // case 1: destination of Mov located in the deletion area
  // case 1.1:
  //     ______________
  //    |              |
  //    |              v
  //   [_____]     [--------]
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //    op1           op0(del)

  // case 1.2:
  //              _______________
  //             |               |
  //             v               |
  //        [--------]       [_____]
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //         op0(del)         op1
  if ((op1.pos+op1.length<=op0.pos && op1.des >= op0.pos && op1.des <= op0.pos+op0.length)
    ||(op1.pos>=op0.pos+op0.length && op1.des>=op0.pos && op1.des<=op0.pos+op0.length)){
    return makeOpMov(op1.pos,op1.length,op0.pos);
  }

  // case 2: destination of Mov located after deletion area
  // case 2.1:
  //     _______________________
  //    |                       |
  //    |                       v
  //   [_____]     [--------]
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //    op1           op0(del)

  // case 2.2:
  //                    _______
  //                   |       |
  //                   v       |
  //        [--------]       [_____]
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //         op0(del)         op1
  if (op1.pos+op1.length<=op0.pos && op1.des >= op0.pos+op0.length){
    return makeOpMov(op1.pos,op1.length,op1.des-op0.length);
  }

  // case 3: Partial Overlap between Mov area and Del area
  // case 3.1:
  //     ____________
  //    |            |
  //    |            V
  //   {____[===}------]
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //    op1       op0(del)
  //
  //           _______
  //          |       |
  //          v       |
  //       [____{===]------}
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //        op0(del)   op1

  if((op1.pos<=op0.pos && op1.pos+op1.length<=op0.pos+op0.length&& op1.pos+op1.length >= op0.pos
    && op1.des<=op0.pos+op0.length && op1.des>=op1.pos) || (op1.pos>=op0.pos && op1.pos<=op0.pos+op0.length
    && op1.pos+op1.length>=op0.pos+op0.length && op1.des>=op0.pos && op1.des<=op1.pos)){
    return makeOpMov(0,0,0); // same as it doesn't move
  }

  // case 3.2:
  //  __
  // |  |
  // |  |
  // v {____[===}------]
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //    op1        op0(del)

  if (op1.pos<=op0.pos && op1.pos+op1.length<=op0.pos+op0.length&& op1.pos+op1.length >= op0.pos && op1.des<=op0.pos){
    return makeOpMov(op1.pos,op0.pos-op1.pos,op1.des);
  }

  // case 3.3:
  //     ___________________
  //    |                   |
  //    |                   V
  //   {____[===}------]
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //    op1       op0(del)
  if (op1.pos<=op0.pos && op1.pos+op1.length<=op0.pos+op0.length&& op1.pos+op1.length >= op0.pos && op1.des>=op0.pos+op0.length){
    return makeOpMov(op1.pos,op0.pos-op1.pos,op1.des-op0.length);
  }

  // case 3.4:
  //     ________________
  //    |                |
  //    v                |
  //       [____{===]------}
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //        op0(del)   op1
  if (op1.pos>=op0.pos && op1.pos<=op0.pos+op0.length && op1.pos+op1.length>=op0.pos+op0.length && op1.des<=op0.pos){
    return makeOpMov(op0.pos,op1.pos+op1.length-op0.pos-op0.length,op1.des);
  }

  // case 3.5:
  //                     ___________
  //                    |           |
  //                    |           v
  //       [____{===]------}
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //        op0(del)   op1
  if (op1.pos>=op0.pos && op1.pos<=op0.pos+op0.length && op1.pos+op1.length>=op0.pos+op0.length && op1.des>=op1.pos+op1.length){
    return makeOpMov(op0.pos,op1.pos+op1.length-op0.pos-op0.length,op1.des-op0.length);
  }

  // case 4: Fully Overlap between Mov area and Del area
  //            ___________________
  //           |                   |
  //           |                   V
  //   [-----{===}------]
  //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
  //          op1  op0(del)
  if (op1.pos>=op0.pos && op1.pos+op1.length<=op0.pos+op0.length){
    return makeOpMov(0,0,0);
  }
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
    }
  } else if (op0.type === "del") {
    if (op1.type === "ins") {
      return transform_del_ins(op0, op1);
    } else if (op1.type === "del") {
      return transform_del_del(op0, op1);
    } else if (op1.type === "mov") {
      return transform_del_mov(op0, op1);
    } else {
      console.log("Transform: no such operator!!!");
    }
  } else {
    console.log("WARNING: ot not implemented");
  }
  return ops;
}
