import {Del, Ins, Mov} from "./op-creators";
import {OpSet} from "../utils";

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
  console.log(op0.value.pos);
  return op1.pos + op1.length <= op0.pos ? OpSet(op1) :
    op1.pos <= op0.pos ? OpSet(
        Del(op1.pos, op0.pos - op1.pos),
        Del(op0.pos + op0.value.length - (op0.pos - op1.pos), op1.length - (op0.pos - op1.pos))
      ) :
      OpSet(Del(op1.pos + op0.value.length, op1.length));
}

function transform_ins_ins(op0, op1) {
  return op1.pos + op1.length <= op0.pos ? OpSet(op1) :
    op1.pos <= op0.pos ? OpSet(
        Ins(op1.pos, op0.value.pos - op1.pos),
        Ins(op0.pos + op0.value.length - (op0.pos - op1.pos), op1.length - (op0.pos - op1.pos))
      ) :
      OpSet(Ins(op1.pos + op0.value.length, op1.length));
}

function transform_del_ins(op0, op1) {
  return op1.pos <= op0.pos ? OpSet(op1) :
    op1.pos <= op0.pos + op0.length ? OpSet(Ins(op0.pos, op1.value)) :
      OpSet(Ins(op1.pos - op0.length, op1.value));
}

function transform_del_del(op0, op1) {
  return op1.pos <= op0.pos ? OpSet(op1) :
    op1.pos <= op0.pos + op0.length ? OpSet(Del(op0.pos, op1.value)) :
      OpSet(Del(op1.pos - op0.length, op1.value));
}

function transform_del_mov(op0, op1) {
  const l1 = op1.length;
  const l0 = op0.length;

  // case 1: Mov area is left to Del area
  /* Wrapped with block comment so the comment could be folded

   // case 1.1:
   //     ______________
   //    |              |
   //    |              v
   //   OpSet(_____)     OpSet(--------)
   //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
   //    op1           op0(del)
   //
   // case 1.2:
   //     _______
   //    |       |
   //    |       v
   //   OpSet(_____)     OpSet(--------)
   //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
   //    op1           op0(del)
   //
   // case 1.3:
   //     _______________________
   //    |                       |
   //    |                       v
   //   OpSet(_____)     OpSet(--------)
   //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
   //    op1           op0(del)
   //
   // case 1.4:
   //  __
   // |  |
   // v  |
   //   OpSet(_____)     OpSet(--------)
   //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
   //    op1           op0(del)
   */
  // case 1
  if (op1.pos + l1 <= op0.pos) {
    if (op1.des >= op0.pos && op1.des <= op0.pos + l0) {
      // case 1.1
      return OpSet(Mov(op1.pos, l1, op0.pos));
    } else if (op1.des >= op0.pos + l0) {
      // case 1.3
      return OpSet(Mov(op1.pos, l1, op1.des - l0));
    } else {
      // case 1.2 & 1.4
      return OpSet(op1);
    }
  } else if (op1.pos <= op0.pos && op1.pos + l1 >= op0.pos && op1.pos + l1 <= op0.pos + l0) {
    // case 2: Partial Overlap (Left to op0 area)
    /*
     // case 2.1:
     //     ____________
     //    |            |
     //    |            V
     //   {____OpSet(===}------)
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //    op1       op0(del)

     // case 2.2:
     //     ___________________
     //    |                   |
     //    |                   V
     //   {____OpSet(===}------)
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //    op1       op0(del)

     // case 2.3:
     //  __
     // |  |
     // |  |
     // v {____OpSet(===}------)
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //    op1        op0(del)

     */
    if (op1.des >= op1.pos + l1 && op1.des <= op0.pos + l0) {
      // case 2.1
      return OpSet(Mov(0, 0, 0));
      // as same as it doesn't move
    } else if (op1.des >= op0.pos + l0) {
      // case 2.2
      return OpSet(Mov(op1.pos, op0.pos - op1.pos, op1.des - l0));
    } else {
      // case 2.3
      return OpSet(Mov(op1.pos, op0.pos - op1.pos, op1.des));
    }
  } else if (op1.pos >= op0.pos && op1.pos + op1.length <= op0.pos + op0.length) {
    // case 3: Fully Overlap between Mov area and Del area
    /*
     //  ________________________
     // |         |              |
     // v         |              V
     //   OpSet(-----{===}------)
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //          op1  op0(del)
     */
    // same as it doesn't move (the move area is deleted before move)
    return OpSet(Mov(0, 0, 0));
  } else if (op1.pos >= op0.pos && op1.pos <= op0.pos + l0 && op1.pos + l1 >= op0.pos + l0) {
    // case 4: Partial Overlap (Right to op0 area)
    /*
     case 4.1
     //           _______
     //          |       |
     //          v       |
     //       OpSet(____{===)------}
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //        op0(del)   op1

     case 4.2
     //     ________________
     //    |                |
     //    v                |
     //       OpSet(____{===)------}
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //        op0(del)   op1

     case 4.3
     //                     ___________
     //                    |           |
     //                    |           v
     //       OpSet(____{===)------}
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //        op0(del)   op1
     */
    if (op1.des >= op0.pos && op1.des <= op1.pos) {
      // case 4.1
      return OpSet(Mov(0, 0, 0));
      // same as it doesn't move
    } else if (op1.des <= op0.pos) {
      // case 4.2
      return OpSet(Mov(op0.pos, op1.pos + l1 - op0.pos - l0, op1.des));
    } else {
      // case 4.3
      return OpSet(Mov(op0.pos, op1.pos + l1 - op0.pos - l0, op1.des - l0));
    }
  } else if (op1.pos >= op0.pos + l0) {
    // case 5: Mov area is right to Del area
    /*
     // case 5.1:
     //              _______________
     //             |               |
     //             v               |
     //        OpSet(--------)       OpSet(_____)
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //         op0(del)         op1

     // case 5.2:
     //                    _______
     //                   |       |
     //                   v       |
     //        OpSet(--------)       OpSet(_____)
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //         op0(del)         op1

     // case 5.3:
     //                            _________
     //                           |         |
     //                           |         v
     //        OpSet(--------)       OpSet(_____)
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //         op0(del)         op1

     // case 5.4:
     //    _______________________
     //   |                       |
     //   v                       |
     //        OpSet(--------)       OpSet(_____)
     //  0 1 2 3 4 5 6 7 8 9 10 11 12 13 ...
     //         op0(del)         op1
     */
    if (op1.des >= op0.pos && op1.des <= op0.pos + l0) {
      // case 5.1
      return OpSet(Mov(op1.pos - l0, l1, op0.pos));
    } else if (op1.des <= op1.pos && op1.des >= op0.pos + l0) {
      // case 5.2
      return OpSet(Mov(op1.pos - l0, l1, op1.des - l0));
    } else if (op1.des >= op1.pos + l1) {
      // case 5.3
      return OpSet(Mov(op1.pos - l0, l1, op1.des - l0));
    } else if (op1.des <= op0.pos) {
      // case 5.4
      return OpSet(Mov(op1.pos - l0, l1, op1.des));
    }
  } else {
    // other cases: idk, man. I'm confusing myself at 5AM
    return OpSet(op1);
  }
}

function transform_ins_mov(op0, op1) {
  const v0 = op0.value;
  const l0 = v0.length;
  const l1 = op1.length;
  const des = op1.des;
  const pos0 = op0.pos;
  const pos1 = op1.pos;

  // case 1: Mov area to the left of Ins point
  /*
   case 1.1

   //     _____
   //    |     |  "X"
   //    |     |   |
   //  OpSet(___)   v   V
   // 0 1 2 3 4 5 6 7 8 9 ...
   //   Mov        Ins


   case 1.2

   //     _____________
   //    |        "X"  |
   //    |         |   |
   //  OpSet(___)       V   v
   // 0 1 2 3 4 5 6 7 8 9 ...
   //   Mov        Ins


   case 1.3
   //  __
   // |  |        "X"
   // |  |         |
   // vOpSet(___)       V
   // 0 1 2 3 4 5 6 7 8 9 ...
   //   Mov        Ins

   */
  if (pos1 + l1 <= pos0) {
    //case 1
    if (des >= pos1 + l1 && des <= pos0 || des <= pos1) {
      // case 1.1 & 1.3
      return OpSet(op1);
    } else if (des >= pos0) {
      // case 1.2
      return OpSet(Mov(pos1, l1, des + l0));
    }
  } else if (pos1 <= pos0 && pos1 + l1 >= pos0) {
    // case 2: Mov area wrapped Ins point
    /*
     case 2.1:
     //
     //  ___ "X"
     // |   | |
     // v  OpSet(__V__)
     // 0 1 2 3 4 5 6 7 8 9 ...
     //    Mov(Ins)

     case 2.2
     //
     //      "X" ____
     //       | |    |
     //    OpSet(__V__)   v
     // 0 1 2 3 4 5 6 7 8 9 ...
     //    Mov(Ins)
     */
    if (des <= pos1) {
      return OpSet(op1);
    } else if (des >= pos1 + l1) {
      return OpSet(Mov(pos1, pos0 - pos1, des + l0), Mov(pos0 + l0, l1 - pos0 + pos1, des + 10));
    }

  } else if (pos1 >= pos0) {
    // case 3: Mov area to the right of Ins point
    /*
     case 3.1:
     //        ______
     //   (x) |      |
     //    |  |      |
     //    v  v    OpSet(___)
     // 0 1 2 3 4 5 6 7 8 9 ...
     //    Ins      Mov

     case 3.2:
     // _____________
     //|  (x)        |
     //|   |         |
     //v   v       OpSet(___)
     // 0 1 2 3 4 5 6 7 8 9 ...
     //    Ins      Mov

     case 3.3:
     //               ____
     //   (x)        |    |
     //    |         |    |
     //    v       OpSet(___)  v
     // 0 1 2 3 4 5 6 7 8 9 ...
     //    Ins      Mov
     */
    if (des <= pos0) {
      return OpSet(Mov(pos1 + l0, l1, des));
    } else if (des >= pos0 && des <= pos1 || des >= pos1 + l1) {
      return OpSet(Mov(pos1 + l0, l1, des + l0));
    }
  } else {
    return OpSet(op1);
  }
}

export function transform(op0, op1) {
  // todo: transform op1 after op0

  if (op0.type === "ins") {
    if (op1.type === "del") {
      return transform_ins_del(op0, op1);
    } else if (op1.type === "ins") {
      return transform_ins_ins(op0, op1);
    } else if (op1.type === "mov") {
      return transform_ins_mov(op0, op1);
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
