export function ins(a, i, items) {
    /** insert items into a, @i^th index.*/
    return [...a.slice(0, i), ...items, ...a.slice(i)]
}
export function del(a,i, l) {
    /** delete l items from a, @i^th index.*/
    return [...a.slice(0, i), ...a.slice(i + l)]
}

export function mov(a, i, l, d) {
    /** move i^th item to d, l number of items. */
    const seg = a.slice(i, i + l);
    return s.splice(0, i).splice(d, 0, seg);
}
