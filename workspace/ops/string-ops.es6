export function ins(s, i, v) {
  return s.splice(i, 0, v);
}
export function del(i, l) {
  return s.splice(i, l)
}

export function mov(i, l, d) {
  const seg = s.slice(i, l);
  return s.splice(i, l).splice(d, 0, seg);
}
