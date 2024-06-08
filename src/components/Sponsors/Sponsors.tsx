import SponsorService from '@/services/sponsorService';
import ContentPane from '../ContentPane/ContentPane';
import styles from './Sponsors.module.scss';
import Link from 'next/link';
import i18nService from '@/services/i18nService';

const Sponsors = async ({ locale }: { locale: string }) => {
  const sponsors = await SponsorService.getAll();
  const l = i18nService.getLocale(locale);
  return (
    <ContentPane>
      <h1>{l.sponsors.title}</h1>
      {sponsors.length === 0 && (
        <p>
          {l.sponsors.empty}{' '}
          <a href="mailto:armit@chalmers.it">armit@chalmers.it</a>
        </p>
      )}
      {sponsors.map((sponsor) => (
        <Link key={sponsor.id} href={sponsor.url}>
          <picture key={sponsor.id}>
            <img
              className={styles.sponsorImg}
              alt={`Sponsorbild för ${sponsor.nameSv}`}
              src={`/api/media/${sponsor.mediaSha256}`}
            />
          </picture>
        </Link>
      ))}
    </ContentPane>
  );
};

export default Sponsors;
