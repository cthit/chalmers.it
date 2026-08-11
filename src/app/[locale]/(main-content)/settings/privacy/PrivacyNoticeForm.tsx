'use client';

import { saveEmailPrivacyNotice } from '@/actions/emailPrivacyNotice';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import i18nService from '@/services/i18nService';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './PrivacyNoticeForm.module.scss';

interface PrivacyNoticeFormProps {
  locale: string;
  titleSv: string;
  contentSv: string;
  titleEn: string;
  contentEn: string;
}

export default function PrivacyNoticeForm({
  locale,
  titleSv,
  contentSv,
  titleEn,
  contentEn
}: PrivacyNoticeFormProps) {
  const l = i18nService.getLocale(locale);
  const [language, setLanguage] = useState<'sv' | 'en'>(
    locale === 'en' ? 'en' : 'sv'
  );
  const [pending, setPending] = useState(false);
  const [swedishTitle, setSwedishTitle] = useState(titleSv);
  const [englishTitle, setEnglishTitle] = useState(titleEn);
  const contentSvRef = useRef<{ getMarkdown: () => string }>(null);
  const contentEnRef = useRef<{ getMarkdown: () => string }>(null);

  async function save() {
    setPending(true);
    try {
      await toast.promise(
        saveEmailPrivacyNotice(
          swedishTitle,
          contentSvRef.current?.getMarkdown() ?? '',
          englishTitle,
          contentEnRef.current?.getMarkdown() ?? ''
        ),
        {
          pending: l.editor.saving,
          success: l.editor.saved,
          error: l.editor.saveError
        }
      );
    } catch {
      // toast.promise displays the save failure.
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className={styles.languageTabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={language === 'sv'}
          className={language === 'sv' ? styles.selected : ''}
          onClick={() => setLanguage('sv')}
        >
          {l.settings.privacy.swedish}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={language === 'en'}
          className={language === 'en' ? styles.selected : ''}
          onClick={() => setLanguage('en')}
        >
          {l.settings.privacy.english}
        </button>
      </div>

      <div role="tabpanel" hidden={language !== 'sv'}>
        <label htmlFor="privacy-title-sv">{l.editor.title}</label>
        <TextArea
          id="privacy-title-sv"
          value={swedishTitle}
          maxLength={500}
          onChange={(event) => setSwedishTitle(event.target.value)}
        />
        <label>{l.editor.content}</label>
        <MarkdownEditor defaultMd={contentSv} ref={contentSvRef} locale={locale} />
      </div>
      <div role="tabpanel" hidden={language !== 'en'}>
        <label htmlFor="privacy-title-en">{l.editor.title}</label>
        <TextArea
          id="privacy-title-en"
          value={englishTitle}
          maxLength={500}
          onChange={(event) => setEnglishTitle(event.target.value)}
        />
        <label>{l.editor.content}</label>
        <MarkdownEditor defaultMd={contentEn} ref={contentEnRef} locale={locale} />
      </div>

      <ActionButton disabled={pending} onClick={save}>
        {l.general.save}
      </ActionButton>
    </>
  );
}
