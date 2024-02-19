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

const PreviewContentStyle = {
  backgroundColor: '#000000AA'
};

interface NewPostFormProps {
  id: number;
  titleEn: string;
  titleSv: string;
  contentEn: string;
  contentSv: string;
}

const PageForm = (description: NewPostFormProps) => {
  marked.use({
    gfm: true,
    breaks: true
  });

  const [titleEn, setTitleEn] = useState(description.titleEn ?? '');
  const [titleSv, setTitleSv] = useState(description.titleSv ?? '');
  const [contentEn, setContentEn] = useState(description.contentEn ?? '');
  const [contentSv, setContentSv] = useState(description.contentSv ?? '');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContentSv, setPreviewContentSv] = useState({
    __html: marked.parse('')
  });
  const [previewContentEn, setPreviewContentEn] = useState({
    __html: marked.parse('')
  });

  async function send() {
    try {
      await edit(description.id, titleEn, titleSv, contentEn, contentSv);
    } catch {
      console.log('Failed to edit group description');
    }
  }

  function preview() {
    const markupSv = marked.parse(contentSv);
    setPreviewContentSv({ __html: markupSv });
    const markupEn = marked.parse(contentEn);
    setPreviewContentEn({ __html: markupEn });

    setShowPreview(true);
  }

  return (
    <>
      <h1>Ändra grupp</h1>
      <Divider />

      <h2>Titel (Eng)</h2>
      <TextArea value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      <h2>Innehåll (Eng)</h2>
      <MarkdownEditor
        value={contentEn}
        onChange={(e) => setContentEn(e.target.value)}
      />

      <h2>Titel (Sv)</h2>
      <TextArea value={titleSv} onChange={(e) => setTitleSv(e.target.value)} />
      <h2>Innehåll (Sv)</h2>
      <MarkdownEditor
        value={contentSv}
        onChange={(e) => setContentSv(e.target.value)}
      />

      <br />
      <div className={style.actions}>
        <ActionButton onClick={send}>
          {description.id !== undefined ? 'Redigera' : 'Skapa'}
        </ActionButton>
        <ActionButton onClick={preview}>Förhandsgranska</ActionButton>
      </div>

      <Popup
        modal
        className={style.dialog}
        open={showPreview}
        onClose={() => setShowPreview(false)}
        overlayStyle={PreviewContentStyle}
      >
        <div className={style.dialog}>
          <h1>Förhandsgranskning</h1>
          <Divider />
          <h2>{titleEn}</h2>
          <p dangerouslySetInnerHTML={previewContentEn} />
          <Divider />
          <h2>{titleSv}</h2>
          <p dangerouslySetInnerHTML={previewContentSv} />

          <ActionButton onClick={() => setShowPreview(false)}>
            Stäng
          </ActionButton>
        </div>
      </Popup>
    </>
  );
};

export default PageForm;
