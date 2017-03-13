export function makeOpIns (pos, value) {
  return {
    type : "ins",
    pos : pos,
    value : value
  };
};

export function makeOpDel (pos, length) {
  return {
    type : "del",
    pos : pos,
    length : length
  };
};

export function makeOpMov (pos, length, des) {
  return {
    type : "mov",
    pos : pos,
    value : length,
    des : des
  };
};
