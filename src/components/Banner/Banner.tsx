import DivisionGroupService from '@/services/divisionGroupService';
import styles from './Banner.module.scss';
import { Roboto_Serif } from 'next/font/google';
import i18nService from '@/services/i18nService';

const robotoSerif = Roboto_Serif({ weight: '600', subsets: ['latin'] });

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

interface BannerProps {
  locale?: string;
  name?: string;
  url?: string;
}

const Banner = async ({ locale, name, url }: BannerProps) => {
  let groupName = name;
  let groupUrl = url;

  if (groupName === undefined || groupUrl === undefined) {
    const banner = await DivisionGroupService.getRandomBanner().catch((e) => {
      console.error(`${e.name}:`, e.message);
      return null;
    });
    groupName = banner?.name;
    groupUrl = banner?.url;
  }

  const validBanner = groupName !== undefined && groupUrl !== undefined;

  return (
    <div className={`${styles.banner} ${robotoSerif.className}`}>
      <BannerTitle locale={locale} />
      <div className={styles.bannerImg}>
        {validBanner && (
          <picture>
            <img
              src={groupUrl}
              alt={'Banner for ' + groupName}
              title={groupName}
            />
          </picture>
        )}
      </div>
    </div>
  );
};

export default Banner;
