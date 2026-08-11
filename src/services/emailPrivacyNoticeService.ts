import prisma from '@/prisma';

const defaultNotice = {
  titleSv: 'Integritetsinformation för nyheter via e-post',
  titleEn: 'Privacy notice for email news',
  contentSv: 'Information om hur e-postadresser behandlas.',
  contentEn: 'Information about how email addresses are processed.'
};

export default class EmailPrivacyNoticeService {
  static async get() {
    return prisma.emailPrivacyNotice.upsert({
      where: { id: 1 },
      create: { id: 1, ...defaultNotice },
      update: {}
    });
  }

  static async save(
    titleSv: string,
    contentSv: string,
    titleEn: string,
    contentEn: string
  ) {
    return prisma.emailPrivacyNotice.upsert({
      where: { id: 1 },
      create: { id: 1, titleSv, contentSv, titleEn, contentEn },
      update: { titleSv, contentSv, titleEn, contentEn }
    });
  }
}
