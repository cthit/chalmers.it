import Divider from '@/components/Divider/Divider';
import SponsorService from '@/services/sponsorService';
import AddSponsorForm from './AddSponsorForm';
import ActionLink from '@/components/ActionButton/ActionLink';
import RemoveSponsorButton from './RemoveSponsorButton';
import i18nService from '@/services/i18nService';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const l = i18nService.getLocale(locale);
  const sponsors = await SponsorService.getAll();

  return (
    <main>
      <title>
        {l.settings.common.controlPanel + ' - ' + l.settings.sponsors.name}
      </title>
      <h1>{l.settings.sponsors.name}</h1>
      <ul>
        {sponsors.map((sponsor) => (
          <li key={sponsor.id}>
            <h2>{sponsor.nameSv}</h2>
            <ActionLink href={sponsor.url}>
              {l.settings.sponsors.link}
            </ActionLink>{' '}
            <RemoveSponsorButton locale={locale} sponsor={sponsor} />
          </li>
        ))}
      </ul>

      <Divider />
      <h1>{l.settings.sponsors.add}</h1>
      <AddSponsorForm locale={locale} />
    </main>
  );
}
