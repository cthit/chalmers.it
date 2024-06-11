import SponsorService from '@/services/sponsorService';
import ContentPane from '../ContentPane/ContentPane';
import styles from './Sponsors.module.scss';
import Link from 'next/link';
import i18nService from '@/services/i18nService';
import React from 'react';

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
      {sponsors.map((sponsor) => {
        const sponsorType =
          sponsor.type === 'MAIN_PARTNER'
            ? l.sponsors.main
            : l.sponsors.partner;
        return (
          <React.Fragment key={sponsor.id}>
            <h2>{sponsorType}</h2>
            <Link href={sponsor.url}>
              <picture key={sponsor.id}>
                <img
                  className={styles.sponsorImg}
                  alt={`Sponsorbild för ${sponsor.nameSv}`}
                  src={`/api/media/${sponsor.mediaSha256}`}
                />
              </picture>
            </Link>
          </React.Fragment>
        );
      })}
    </ContentPane>
  );
};

export default Sponsors;
