'use server';

import EmailPrivacyNoticeService from '@/services/emailPrivacyNoticeService';
import SessionService from '@/services/sessionService';

export async function saveEmailPrivacyNotice(
  titleSv: string,
  contentSv: string,
  titleEn: string,
  contentEn: string
) {
  if (!(await SessionService.isAdmin())) throw new Error('Unauthorized');
  if (
    !titleSv.trim() ||
    !contentSv.trim() ||
    !titleEn.trim() ||
    !contentEn.trim() ||
    titleSv.length > 500 ||
    titleEn.length > 500 ||
    contentSv.length > 100_000 ||
    contentEn.length > 100_000
  ) {
    throw new Error('Invalid privacy notice');
  }

  await EmailPrivacyNoticeService.save(
    titleSv,
    contentSv,
    titleEn,
    contentEn
  );
}
