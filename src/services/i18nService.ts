import swedish from '@/dictionaries/sv.json';
import english from '@/dictionaries/en.json';

export default class i18nService {
  static getLocale = (loc?: string) => (loc === 'en' ? english : swedish);

  static formatDate = (date: Date, useTime = true) => {
    return date
      .toLocaleDateString(['sv-SE'], {
        timeZone: 'Europe/Stockholm',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: useTime ? '2-digit' : undefined,
        minute: useTime ? '2-digit' : undefined
      })
      .replace(',', '');
  };

  static formatTime = (date: Date) => {
    return date.toLocaleTimeString(['sv-SE'], {
      timeZone: 'Europe/Stockholm',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
}
