import { SpokenLanguage } from '@prisma/client';

type NewsPostConnectedEvents = {
  connectedEvents: { spokenLanguage: SpokenLanguage | null }[];
};

export function getNewsPostSpokenLanguage(
  post: NewsPostConnectedEvents
): SpokenLanguage | null {
  const spokenLanguages: Set<SpokenLanguage> = new Set(
    post.connectedEvents.map((e) => e.spokenLanguage).filter((e) => e != null)
  );

  if (spokenLanguages.size === 0) {
    return null;
  } else if (spokenLanguages.size === 1) {
    return spokenLanguages.values().next().value!;
  } else {
    return SpokenLanguage.SV_EN;
  }
}
