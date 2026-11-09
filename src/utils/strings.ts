export function capitalize(val: string): string {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function joinSentence(
  items: string[],
  lastSeparator: string,
  separator: string = ', '
): string {
  if (items.length === 0) {
    return '';
  }
  if (items.length === 1) {
    return items[0];
  }
  return (
    items.slice(0, items.length - 1).join(separator) +
    ' ' +
    lastSeparator +
    ' ' +
    items[items.length - 1]
  );
}
