export function OpSet() {
  return Array.prototype.concat.apply([], Array.from(arguments));
}
