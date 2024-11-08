import schedule from 'node-schedule';
import NewsService from './services/newsService';
import DivisionGroupService from './services/divisionGroupService';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Patching logger');
    await require('pino');
    await require('pino-pretty');
    await require('next-logger');

    console.log('Scheduling tasks');
    const newsPublishRule = new schedule.RecurrenceRule();
    newsPublishRule.second = 0;

    schedule.scheduleJob(newsPublishRule, NewsService.publishScheduled);
    schedule.scheduleJob(
      '0 0 * * 1',
      DivisionGroupService.updatePrettyNamesFromGamma
    );
  }
}
