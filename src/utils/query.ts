import { EventLanguage } from '@prisma/client';

export function isValidQuery(input: {
  query?: string | null;
  groupId?: string | null;
  userId?: string | null;
  eventLanguage?: EventLanguage | null;
}) {
  const { query, groupId, userId, eventLanguage } = input;
  return (
    (query != undefined && query.length >= 3) ||
    groupId != undefined ||
    userId != undefined ||
    eventLanguage != undefined
  );
}
