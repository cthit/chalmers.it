import DivisionGroupService from '@/services/divisionGroupService';
import styles from './Banner.module.scss';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

const BannerTitle = () => {
  return (
    <div className={styles.title}>
      <h2>Teknologsektionen</h2>
      <h1>Informationsteknik</h1>
      <h2>Chalmers Studentkår</h2>
    </div>
  );
};

const Banner = async () => {
  const banner = await DivisionGroupService.getRandomBanner();

  return (
    <div className={`${styles.banner} ${playfair.className}`}>
      <BannerTitle />
      <div className={styles.bannerImg}>
        {banner && (
          <picture>
            <img src={`/api/media/${banner.mediaSha256}`} alt="Page banner" />
          </picture>
        )}
      </div>
    </div>
  );
};

export default Banner;
