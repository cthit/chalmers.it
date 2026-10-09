export function parseIdParam(value: string): number | null {
  const id = Number.parseInt(value, 10);
  return isNaN(id) || id < 0 ? null : id;
}
