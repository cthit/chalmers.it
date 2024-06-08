'use client';

import { edit } from './actions';
import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import { useState } from 'react';
import { marked } from 'marked';
import style from './PageForm.module.scss';
import Popup from 'reactjs-popup';
import i18nService from '@/services/i18nService';
import MarkdownView from '../MarkdownView/MarkdownView';

const PreviewContentStyle = {
  backgroundColor: '#000000AA'
};

interface NewPostFormProps {
  id: number;
  titleEn: string;
  titleSv: string;
  contentEn: string;
  contentSv: string;
  slug: string;
  locale: string;
}

const PageForm = (description: NewPostFormProps) => {
  marked.use({
    gfm: true,
    breaks: true
  });
  const l = i18nService.getLocale(description.locale);

  const [titleEn, setTitleEn] = useState(description.titleEn ?? '');
  const [titleSv, setTitleSv] = useState(description.titleSv ?? '');
  const [contentEn, setContentEn] = useState(description.contentEn ?? '');
  const [contentSv, setContentSv] = useState(description.contentSv ?? '');
  const [slug, setSlug] = useState(description.slug ?? '');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContentSv, setPreviewContentSv] = useState('');
  const [previewContentEn, setPreviewContentEn] = useState('');

  async function send() {
    try {
      await edit(description.id, titleEn, titleSv, contentEn, contentSv, slug);
    } catch {
      console.log('Failed to edit group description');
    }
  }

  function preview() {
    setPreviewContentSv(contentSv);
    setPreviewContentEn(contentEn);

    setShowPreview(true);
  }

  return (
    <>
      <h1>{l.pages.editGroupPage}</h1>
      <Divider />

      <h2>{l.pages.urlSlug}</h2>
      <TextArea value={slug} onChange={(e) => setSlug(e.target.value)} />

      <h2>{l.editor.title} (En)</h2>
      <TextArea value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      <h2>{l.editor.content} (En)</h2>
      <MarkdownEditor
        value={contentEn}
        onChange={(e) => setContentEn(e.target.value)}
      />

      <h2>{l.editor.title} (Sv)</h2>
      <TextArea value={titleSv} onChange={(e) => setTitleSv(e.target.value)} />
      <h2>{l.editor.content} (Sv)</h2>
      <MarkdownEditor
        value={contentSv}
        onChange={(e) => setContentSv(e.target.value)}
      />

      <br />
      <div className={style.actions}>
        <ActionButton onClick={send}>
          {description.id !== undefined ? l.general.edit : l.general.create}
        </ActionButton>
        <ActionButton onClick={preview}>{l.editor.previewAction}</ActionButton>
      </div>

      <Popup
        modal
        className={style.dialog}
        open={showPreview}
        onClose={() => setShowPreview(false)}
        overlayStyle={PreviewContentStyle}
      >
        <div className={style.dialog}>
          <h1>{l.editor.preview}</h1>
          <Divider />
          <MarkdownView content={previewContentEn} />
          <Divider />
          <MarkdownView content={previewContentSv} />

          <ActionButton onClick={() => setShowPreview(false)}>
            {l.general.close}
          </ActionButton>
        </div>
      </Popup>
    </>
  );
};

export default PageForm;
