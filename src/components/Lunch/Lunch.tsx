import LunchService from '@/services/lunchService';
import Divider from '../Divider/Divider';
import i18nService from '@/services/i18nService';
import ContentPane from '../ContentPane/ContentPane';
import styles from './Lunch.module.scss';

const Lunch = async ({ locale }: { locale: string }) => {
  const lunch = await LunchService.getLunch();
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';
  return (
    <ContentPane>
      <h1 className={styles.title}>{en ? 'Lunch Menu' : 'Lunchmeny'}</h1>
      <Divider />
      {lunch.length === 0 && <p>{l.lunch.nolunch}</p>}
      {lunch.map((restaurant, index) => (
        <div key={restaurant.name} className={styles.restaurant}>
          <h2>{restaurant.name}</h2>
          {(en ? restaurant.meals.en : restaurant.meals.sv).map((meal) => (
            <div key={meal.title} className={styles.meal}>
              <h3>{meal.title}</h3>
              <p>{meal.summary}</p>
            </div>
          ))}
          {index < lunch.length - 1 && (
            <div className={styles.divider}>
              <Divider />
            </div>
          )}
        </div>
      ))}
    </ContentPane>
  );
};

export default Lunch;
