import Divider from '@/components/Divider/Divider';
import SponsorService from '@/services/sponsorService';
import AddSponsorForm from './AddSponsorForm';
import ActionButton from '@/components/ActionButton/ActionButton';

export default async function Page() {
  const sponsors = await SponsorService.getAll();

  return (
    <main>
      <title>Kontrollpanel - Sponsors</title>
      <h1>Sponsors</h1>
      <ul>
        {sponsors.map((sponsor) => (
          <li key={sponsor.id}>
            <h2>{sponsor.nameSv}</h2>
            <ActionButton href={sponsor.url}>Länk</ActionButton>
          </li>
        ))}
      </ul>

      <Divider />
      <h1>Add a sponsor</h1>
      <AddSponsorForm />
    </main>
  );
}
