import DivisionGroupService from '@/services/divisionGroupService';
import styles from './Banner.module.scss';
import { Playfair_Display } from 'next/font/google';
import i18nService from '@/services/i18nService';

const playfair = Playfair_Display({ subsets: ['latin'] });

const BannerTitle = ({ locale }: { locale?: string }) => {
  const l = i18nService.getLocale(locale);
  return (
    <div className={styles.title}>
      <h2>{l.banner.top}</h2>
      <h1>{l.site.title}</h1>
      <h2>{l.site.subtitle}</h2>
    </div>
  );
};

const Banner = async ({ locale }: { locale?: string }) => {
  const banner = await DivisionGroupService.getRandomBanner().catch((e) => {
    console.error(`${e.name}:`, e.message);
    return null;
  });

  return (
    <div className={`${styles.banner} ${playfair.className}`}>
      <BannerTitle locale={locale} />
      <div className={styles.bannerImg}>
        {banner && (
          <picture>
            <img src={banner.url} alt={"Banner for " + banner.name} title={banner.name} />
          </picture>
        )}
      </div>
    </div>
  );
};

export default Banner;
