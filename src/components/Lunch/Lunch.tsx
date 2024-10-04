import LunchService from '@/services/lunchService';
import Divider from '../Divider/Divider';
import i18nService from '@/services/i18nService';
import Collapsible from '../ContentPane/Collapsible/Collapsible';
import ContentPane from '../ContentPane/ContentPane';

const Lunch = async ({ locale }: { locale: string }) => {
  const lunch = await LunchService.getLunch();
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';
  return (
    <ContentPane>
      <h1>Lunch</h1>
      <Divider />
      <Collapsible>
        {lunch.length === 0 && <p>{l.lunch.nolunch}</p>}
        {lunch.map((restaurant) => (
          <div key={restaurant.name}>
            <h2>{restaurant.name}</h2>
            {(en ? restaurant.meals.en : restaurant.meals.sv).map((meal) => (
              <div key={meal.title}>
                <h3>{meal.title}</h3>
                <p>{meal.summary}</p>
              </div>
            ))}
          </div>
        ))}
      </Collapsible>
    </ContentPane>
  );
};

export default Lunch;
