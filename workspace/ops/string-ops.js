"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ins = ins;
exports.del = del;
exports.mov = mov;
function ins(s, i, v) {
  return s.splice(i, 0, v);
}
function del(i, l) {
  return s.splice(i, l);
}

function mov(i, l, d) {
  var seg = s.slice(i, l);
  return s.splice(i, l).splice(d, 0, seg);
}