import ThemeStatus from '@/components/ThemeStatus/ThemeStatus';
import i18nService from '@/services/i18nService';
import SessionService from '@/services/sessionService';

export default async function Page(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const l = i18nService.getLocale(locale);
  const user = await SessionService.getUser();

  return (
    <main>
      <title>
        {l.settings.common.controlPanel + ' - ' + l.settings.general.name}
      </title>
      <h1>{l.settings.general.user}</h1>
      {user ? (
        <p>
          {l.settings.general.loggedIn} {user.name}
        </p>
      ) : (
        <p>{l.settings.general.notLoggedIn}</p>
      )}
      <h1>{l.settings.general.theme}</h1>
      <ThemeStatus locale={locale} />
    </main>
  );
}
