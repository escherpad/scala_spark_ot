// todo: add hierarchical op handling logic? here or in reducer?

export function ins(o, k, v) {
  /** insert value v into object o, @key k.*/
  return {...o, k: v};
}
export function del(o, k) {
  /** delete key k from o*/
  const new_o = {...o};
  delete o[k];
  return o;
}

export function mov(o, k, k_) {
  /** change key k of o to k_ */
  const new_o = {...o};
  new_o[k_] = o[k];
  delete o[k];
  return o;
}
