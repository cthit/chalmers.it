import LunchService from '@/services/lunchService';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import styles from './Lunch.module.scss';

const Lunch = async () => {
  const lunch = await LunchService.getLunch();
  return (
    <ContentPane>
        <div className={styles.scroll}>
      <h1>Lunch</h1>
      <Divider />
      {lunch.map((restaurant) => (
        <div key={restaurant.name}>
          <h2>{restaurant.name}</h2>
          {restaurant.meals.en.map((meal) => (
            <div key={meal.title}>
              <h3>{meal.title}</h3>
              <p>{meal.summary}</p>
            </div>
          ))}
        </div>
      ))}
      </div>
    </ContentPane>
  );
};

export default Lunch;
