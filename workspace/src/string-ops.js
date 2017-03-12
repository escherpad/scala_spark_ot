export function ins(s, i, v) {
  return s.slice(0, i) + v + s.slice(i);
}

export function del(s, i, l) {
  return s.slice(0, i) + s.slice(i+l);
}

export function mov(s, i, l, d) {
    return s.slice(0, i) + s.slice(i+l, d) + s.slice(d, l);
}

