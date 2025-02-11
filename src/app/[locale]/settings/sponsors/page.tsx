import SponsorService from '@/services/sponsorService';
import AddSponsorForm from './AddSponsorForm';
import ActionLink from '@/components/ActionButton/ActionLink';
import RemoveSponsorButton from './RemoveSponsorButton';
import i18nService from '@/services/i18nService';
import Table from '@/components/Table/Table';
import { SponsorType } from '@prisma/client';

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
      <Table>
        <thead>
          <tr>
            <td>ID</td>
            <td>{l.settings.common.type}</td>
            <td>{l.settings.common.name}</td>
            <td>URL</td>
            <td>{l.settings.sponsors.image}</td>
            <td>{l.settings.common.actions}</td>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor) => (
            <tr key={sponsor.id}>
              <td>{sponsor.id}</td>
              <td>
                {sponsor.type === SponsorType.MAIN_PARTNER
                  ? l.sponsors.main
                  : l.sponsors.partner}
              </td>
              <td>{sponsor.nameSv}</td>
              <td>
                <ActionLink target="_blank" href={sponsor.url}>
                  {l.settings.sponsors.link}
                </ActionLink>
              </td>
              <td>
                <ActionLink
                  target="_blank"
                  href={'/api/media/' + sponsor.mediaSha256}
                >
                  {l.settings.sponsors.openImage}
                </ActionLink>
              </td>
              <td>
                <RemoveSponsorButton locale={locale} sponsor={sponsor} />
              </td>
            </tr>
          ))}
          <AddSponsorForm locale={locale} />
        </tbody>
      </Table>
    </main>
  );
}
