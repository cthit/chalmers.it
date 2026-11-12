export const DEFAULT_MAX_MEDIA_SIZE_BYTES = 100 * 1024 * 1024;
export const DEFAULT_MAX_UPLOAD_SIZE_BYTES = 500 * 1024 * 1024;

export function parsePositiveIntEnv(
  value: string | undefined,
  fallback: number
): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
