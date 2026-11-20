'use client';

import TextArea from '@/components/TextArea/TextArea';
import i18nService from '@/services/i18nService';
import { capitalize } from '@/utils/strings';
import style from './LocalizedTitleFields.module.scss';

interface LocalizedTitleFieldsProps {
  locale: string;
  titleEn: string;
  titleSv: string;
  onChangeEn: (title: string) => void;
  onChangeSv: (title: string) => void;
  required?: boolean;
}

const LocalizedTitleFields = ({
  locale,
  titleEn,
  titleSv,
  onChangeEn,
  onChangeSv,
  required = true
}: LocalizedTitleFieldsProps) => {
  const l = i18nService.getLocale(locale);
  const languageOrder: ('en' | 'sv')[] =
    locale === 'en' ? ['en', 'sv'] : ['sv', 'en'];

  return (
    <div className={style.fields}>
      {languageOrder.map((language) => (
        <label className={style.field} key={language}>
          <span>{capitalize(l.events.languages[language])}</span>
          <TextArea
            value={language === 'en' ? titleEn : titleSv}
            onChange={(ev) =>
              language === 'en'
                ? onChangeEn(ev.target.value)
                : onChangeSv(ev.target.value)
            }
            required={required}
          />
        </label>
      ))}
    </div>
  );
};

export default LocalizedTitleFields;
