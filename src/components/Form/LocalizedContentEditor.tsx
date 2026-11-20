'use client';

import { useId, useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import MediaUploader from '@/components/MediaUploader/MediaUploader';
import i18nService from '@/services/i18nService';
import { capitalize } from '@/utils/strings';
import style from './LocalizedContentEditor.module.scss';

export interface LocalizedContentEditorProps {
  locale: string;
  label: string;
  contentEn: string;
  contentSv: string;
  onChangeEn: (content: string) => void;
  onChangeSv: (content: string) => void;
  uploadQueue: { [key: string]: File };
  onUpload: (
    files: FileList | File[]
  ) => Promise<{ file: File; url: string }[]>;
  onRemoveFile: (sha256: string) => void;
  maxFileSizeBytes?: number;
  maxUploadSizeBytes?: number;
  isLanguageComplete?: (language: 'en' | 'sv') => boolean;
}

const LocalizedContentEditor = ({
  locale,
  label,
  contentEn,
  contentSv,
  onChangeEn,
  onChangeSv,
  uploadQueue,
  onUpload,
  onRemoveFile,
  maxFileSizeBytes,
  maxUploadSizeBytes,
  isLanguageComplete
}: LocalizedContentEditorProps) => {
  const l = i18nService.getLocale(locale);
  const baseId = useId();
  const languageOrder: ('en' | 'sv')[] =
    locale === 'en' ? ['en', 'sv'] : ['sv', 'en'];
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'sv'>(
    languageOrder[0]
  );

  const languageLabel = (language: 'en' | 'sv') =>
    capitalize(l.events.languages[language]);
  const isComplete = (language: 'en' | 'sv') =>
    isLanguageComplete?.(language) ??
    (language === 'en' ? contentEn : contentSv).trim() !== '';

  const selectAdjacentLanguage = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const currentIndex = languageOrder.indexOf(activeLanguage);
    const nextLanguage =
      languageOrder[
        (currentIndex + direction + languageOrder.length) %
          languageOrder.length
      ];
    setActiveLanguage(nextLanguage);
    document.getElementById(`content-tab-${baseId}-${nextLanguage}`)?.focus();
  };

  return (
    <>
      <div className={style.tabs} role="tablist" aria-label={label}>
        {languageOrder.map((language) => {
          const complete = isComplete(language);
          const languageName = languageLabel(language);
          const status = complete
            ? l.editor.languageComplete
            : l.editor.languageIncomplete;

          return (
            <button
              key={language}
              id={`content-tab-${baseId}-${language}`}
              type="button"
              role="tab"
              aria-selected={activeLanguage === language}
              aria-controls={`content-panel-${baseId}-${language}`}
              tabIndex={activeLanguage === language ? 0 : -1}
              className={`${style.tab} ${
                activeLanguage === language ? style.tabActive : ''
              }`}
              aria-label={`${languageName} ${status}`}
              title={`${languageName} ${status}`}
              onClick={() => setActiveLanguage(language)}
              onKeyDown={selectAdjacentLanguage}
            >
              {languageName}
              <span
                className={`${style.status} ${
                  complete ? '' : style.incomplete
                }`}
                aria-hidden="true"
              >
                {complete ? '✓' : '•'}
              </span>
            </button>
          );
        })}
      </div>
      {languageOrder.map((language) => (
        <div
          key={language}
          id={`content-panel-${baseId}-${language}`}
          role="tabpanel"
          aria-labelledby={`content-tab-${baseId}-${language}`}
          hidden={activeLanguage !== language}
          className={style.panel}
        >
          <MarkdownEditor
            value={language === 'en' ? contentEn : contentSv}
            onUpload={onUpload}
            onChange={language === 'en' ? onChangeEn : onChangeSv}
            locale={locale}
            localFiles={uploadQueue}
            ariaLabel={`${label} ${languageLabel(language)}`}
          />
        </div>
      ))}
      <MediaUploader
        locale={locale}
        uploadQueue={uploadQueue}
        onSelect={onUpload}
        onRemove={onRemoveFile}
        maxFileSizeBytes={maxFileSizeBytes}
        maxUploadSizeBytes={maxUploadSizeBytes}
      />
    </>
  );
};

export default LocalizedContentEditor;
