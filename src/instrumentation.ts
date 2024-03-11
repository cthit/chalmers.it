import schedule from 'node-schedule';
import NewsService from './services/newsService';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Patching logger');
    await require('pino');
    await require('pino-pretty');
    await require('colorette');
    await require('ansis/colors');
    await require('next-logger');

    console.log('Scheduling tasks');
    const rule = new schedule.RecurrenceRule();
    rule.second = 0;

    schedule.scheduleJob(rule, NewsService.publishScheduled);
  }
}
