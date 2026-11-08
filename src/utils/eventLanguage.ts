import { EventLanguage, Event } from '@prisma/client';

type NewsPostConnectedEvents = {
  connectedEvents: Pick<Event, 'language'>[];
};

export function getNewsPostEventLanguage(
  post: NewsPostConnectedEvents
): EventLanguage | null {
  const languages: Set<EventLanguage> = new Set(
    post.connectedEvents.map((e) => e.language).filter((e) => e != null)
  );

  if (languages.size === 0) {
    return null;
  } else if (languages.size === 1) {
    return languages.values().next().value!;
  } else {
    return EventLanguage.SV_EN;
  }
}
