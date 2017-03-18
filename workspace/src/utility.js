export function Ins(pos, value) {
  return {
    type: "ins",
    pos: pos,
    value: value
  };
};

export function Del(pos, length) {
  return {
    type: "del",
    pos: pos,
    length: length
  };
}

export function Mov(pos, length, des) {
  return {
    type: "mov",
    pos: pos,
    length: length,
    des: des
  };
};
