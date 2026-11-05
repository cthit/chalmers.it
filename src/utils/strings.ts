export function capitalize(val: string): string {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
