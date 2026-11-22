export function stripTime(d: Date) {
  return new Date(d).setHours(0, 0, 0, 0) - d.getTimezoneOffset() * 60 * 1000;
}
