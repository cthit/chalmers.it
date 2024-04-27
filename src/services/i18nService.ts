import swedish from '@/dictionaries/sv.json';
import english from '@/dictionaries/en.json';

export default class i18nService {
  static getLocale = (loc?: string) => (loc === 'en' ? english : swedish);
}
