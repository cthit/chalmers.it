import { SpokenLanguage } from '@prisma/client';

export function isValidQuery(input: {
  query?: string | null;
  groupId?: string | null;
  userId?: string | null;
  spokenLanguage?: SpokenLanguage | null;
}) {
  const { query, groupId, userId, spokenLanguage } = input;
  return (
    (query != undefined && query.length >= 3) ||
    groupId != undefined ||
    userId != undefined ||
    spokenLanguage != undefined
  );
}
