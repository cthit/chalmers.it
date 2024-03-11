const lunchUrl = process.env.LUNCH_URL || 'https://lunch.chalmers.it';

interface Restaurant {
  name: string;
  meals: {
    en: Meal[];
    sv: Meal[];
  };
}

interface Meal {
  title: string;
  date: string;
  summary: string;
}

export default class LunchService {
  static async getLunch(): Promise<Restaurant[]> {
    const response = await fetch(lunchUrl);
    return await response.json();
  }
}
