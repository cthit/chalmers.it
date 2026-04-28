import i18nService from '@/services/i18nService';
import MediaService from '@/services/mediaService';

function bytesToSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const l = i18nService.getLocale(locale);
  const stats = await MediaService.getStats();

  return (
    <main>
      <title>
        {l.settings.common.controlPanel + ' - ' + l.settings.media.name}
      </title>
      <h1>{l.settings.media.name}</h1>
      <p>
        {l.settings.media.stored}: {stats.count}
      </p>
      <p>
        {l.settings.media.usage}: {bytesToSize(stats.size)}
      </p>
      <p>
        {l.settings.media.orphaned}: {stats.count - stats.used}
      </p>
    </main>
  );
}
