import i18nService from '@/services/i18nService';
import MediaService from '@/services/mediaService';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const l = i18nService.getLocale(locale);
  const stats = await MediaService.getStats();

  return (
    <main>
      <title>{l.settings.common.controlPanel + ' - ' + l.settings.media.name}</title>
      <h1>{l.settings.media.name}</h1>
      <p>
        {l.settings.media.stored}: {stats.count}
      </p>
      <p>
        {l.settings.media.usage}: {stats.size} bytes
      </p>
      <p>
        {l.settings.media.orphaned}: {stats.count - stats.used}
      </p>
    </main>
  );
}
