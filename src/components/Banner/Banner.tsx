import DivisionGroupService from '@/services/divisionGroupService';
import styles from './Banner.module.scss';

const Banner = async () => {
    const banner = await DivisionGroupService.getRandomBanner();

  return (<div className={styles.banner}>
    <img src={`/api/media/${banner.mediaSha256}`} />
  </div>);
};

export default Banner;
