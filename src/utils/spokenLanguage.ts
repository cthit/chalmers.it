import { SpokenLanguage } from '@prisma/client';

type NewsPostConnectedEvents = {
  connectedEvents: { spokenLanguage: SpokenLanguage | null }[];
};

export function getNewsPostSpokenLanguage(
  post: NewsPostConnectedEvents
): SpokenLanguage | null {
  const spokenLanguages = new Set(
    post.connectedEvents.map((e) => e.spokenLanguage).filter((e) => e != null)
  );
  return spokenLanguages.size === 0
    ? null
    : spokenLanguages.size === 1
      ? spokenLanguages.values().toArray()[0]
      : spokenLanguages.has(SpokenLanguage.OTHER)
        ? SpokenLanguage.OTHER
        : SpokenLanguage.SV_EN;
}
