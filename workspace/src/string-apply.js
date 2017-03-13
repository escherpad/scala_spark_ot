import {ins, del, mov} from "./string-ops";
export function applyOp(s, op) {
  if (op.type === "ins") {
    return ins(s, op.pos, op.value);
  } else if (op.type === "del") {
    return del(s, op.pos, op.length);
  } else if (op.type === "mov") {
    return mov(s, op.pos, op.length, op.des);
  }
  return s;
}
