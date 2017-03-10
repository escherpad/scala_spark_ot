export function ins(s, i, v) {
  return s.slice(0, i) + v + s.slice(i);
}

export function del(i, l) {
    return s.slice(0, i) + s.slice(i+l);
}

export function mov(s, i, l, d) {
  const seg = s.slice(i, l);
  return s.splice(i, l).splice(d, 0, seg);
}

