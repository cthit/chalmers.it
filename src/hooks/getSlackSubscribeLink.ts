'use server';

import i18nService from '@/services/i18nService';

const { SUBSCRIBE_SLACK_URL_EN: EN, SUBSCRIBE_SLACK_URL_SV: SV } = process.env;

export default async function getSlackSubscribeLink(): Promise<string | null> {
  const isEn = i18nService.getLocale().en;
  return (isEn ? EN : SV) || null;
}
