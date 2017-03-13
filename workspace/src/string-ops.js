export function ins(s, i, v) {
  return s.slice(0, i) + v + s.slice(i);
}

export function del(s, i, l) {
  return s.slice(0, i) + s.slice(i + l);
}

export function mov(s, i, l, d) {
  if (d >= i + l) {
    // move forward
    return s.slice(0, i) + s.slice(i + l, d) + s.slice(i, i + l) + s.slice(d);
  } else if (d < i) {
    // move backward
    return s.slice(0, d) + s.slice(i, i + l) + s.slice(d, i) + s.slice(i + l);
  } else {
    // identity
    return s;
  }

}

