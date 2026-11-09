import { EventLanguage, Event } from '@prisma/client';

type NewsPostConnectedEvents = {
  connectedEvents: Pick<Event, 'language'>[];
};

/** Summary of how many events with each language there are. */
export interface EventLanguageSummary {
  total: number;
  languages: {
    [Lang in EventLanguage]: number;
  } & {
    map<T>(transform: ([language, count]: [EventLanguage, number]) => T): T[];
  };
}

export function getNewsPostEventLanguages(
  post: NewsPostConnectedEvents
): EventLanguageSummary {
  const summary: EventLanguageSummary = {
    total: 0,
    languages: {
      SV: 0,
      EN: 0,
      SV_EN: 0,
      map<T>(
        transform: ([language, count]: [EventLanguage, number]) => T
      ): T[] {
        const properties: [EventLanguage, number][] = [
          EventLanguage.SV,
          EventLanguage.EN,
          EventLanguage.SV_EN
        ].map((lang) => [lang, this[lang]]);

        return properties.map((x) => transform(x));
      }
    }
  };
  post.connectedEvents.forEach((e) => {
    if (e.language != null) {
      summary.total++;
      summary.languages[e.language]++;
    }
  });
  return summary;
}
