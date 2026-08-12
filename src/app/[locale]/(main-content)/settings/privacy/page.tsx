import Forbidden from '@/components/ErrorPages/403/403';
import i18nService from '@/services/i18nService';
import EmailPrivacyNoticeService from '@/services/emailPrivacyNoticeService';
import SessionService from '@/services/sessionService';
import PrivacyNoticeForm from './PrivacyNoticeForm';
import EmailTestForm from './EmailTestForm';

export default async function PrivacySettingsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!(await SessionService.isAdmin())) return <Forbidden />;

  const l = i18nService.getLocale(locale);
  const notice = await EmailPrivacyNoticeService.get();

  return (
    <main>
      <title>
        {l.settings.common.controlPanel + ' - ' + l.settings.privacy.name}
      </title>
      <h1>{l.settings.privacy.title}</h1>
      <PrivacyNoticeForm
        locale={locale}
        titleSv={notice.titleSv}
        contentSv={notice.contentSv}
        titleEn={notice.titleEn}
        contentEn={notice.contentEn}
      />
      <EmailTestForm locale={locale} />
    </main>
  );
}
