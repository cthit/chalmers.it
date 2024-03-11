import SponsorService from '@/services/sponsorService';
import ContentPane from '../ContentPane/ContentPane';
import styles from './Sponsors.module.scss';

const Sponsors = async () => {
  const sponsors = await SponsorService.getAll();
  return (
    <ContentPane>
      <h1>Samarbetspartners</h1>
      {sponsors.map((sponsor) => (
        <picture key={sponsor.id}>
          <img
            className={styles.sponsorImg}
            src={`/api/media/${sponsor.mediaSha256}`}
          />
        </picture>
      ))}
    </ContentPane>
  );
};

export default Sponsors;
