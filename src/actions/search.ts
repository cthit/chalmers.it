'use server';

import NewsService from '@/services/newsService';
import SessionService from '@/services/sessionService';

export async function search(
  query: string,
  locale: string,
  before?: Date,
  after?: Date
) {
  const user = await SessionService.getUser();
  const groups = await SessionService.getActiveGroups();
  return await NewsService.search(
    query,
    locale,
    before,
    after,
    user?.id,
    groups.map((g) => g.superGroup.id)
  );
}
