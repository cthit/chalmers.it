import SponsorService from '@/services/sponsorService';
import ContentPane from '../ContentPane/ContentPane';
import styles from './Sponsors.module.scss';
import Link from 'next/link';

const Sponsors = async () => {
  const sponsors = await SponsorService.getAll();
  return (
    <ContentPane>
      <h1>Samarbetspartners</h1>
      {sponsors.length === 0 ?? (
        <p>
          Vill du synas här? Kontakta{' '}
          <a href="mailto:armit@chalmers.it">armit@chalmers.it</a>
        </p>
      )}
      {sponsors.map((sponsor) => (
        <Link href={sponsor.url}>
          <picture key={sponsor.id}>
            <img
              className={styles.sponsorImg}
              src={`/api/media/${sponsor.mediaSha256}`}
            />
          </picture>
        </Link>
      ))}
    </ContentPane>
  );
};

export default Sponsors;
