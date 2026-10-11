export function parseIdParam(value: string): number | null {
  if (value.trim() !== value || value === '') return null;

  const id = Number(value);
  if (Number.isInteger(id) && id >= 0) return id;

  return null;
}
