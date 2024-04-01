'use client';

import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import { GammaGroup } from '@/types/gamma';
import { useState } from 'react';
import DropdownList from '../DropdownList/DropdownList';
import { marked } from 'marked';
import style from '../NewsPostForm/NewsPostForm.module.scss';
import Popup from 'reactjs-popup';
import DatePicker from '../DatePicker/DatePicker';
import { DivisionPage } from '@/services/divisionPageService';

const PreviewContentStyle = {
  backgroundColor: '#000000AA'
};

interface DivisionPostFormProps {
  pages: DivisionPage[];
  parentId?: number;
  titleEn?: string;
  titleSv?: string;
  contentEn?: string;
  contentSv?: string;
}

const DivisionPageForm = (divisionPost: DivisionPostFormProps) => {
  marked.use({
    pedantic: false,
    breaks: true,
    gfm: true
  });

  const [page, setPage] = useState(divisionPost.parentId);
  const [titleEn, setTitleEn] = useState(divisionPost.titleEn ?? '');
  const [titleSv, setTitleSv] = useState(divisionPost.titleSv ?? '');
  const [contentEn, setContentEn] = useState(divisionPost.contentEn ?? '');
  const [contentSv, setContentSv] = useState(divisionPost.contentSv ?? '');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContentSv, setPreviewContentSv] = useState({
    __html: marked.parse('')
  });
  const [previewContentEn, setPreviewContentEn] = useState({
    __html: marked.parse('')
  });

  function preview() {
    const markupSv = marked.parse(contentSv);
    setPreviewContentSv({ __html: markupSv });
    const markupEn = marked.parse(contentEn);
    setPreviewContentEn({ __html: markupEn });

    setShowPreview(true);
  }

  return (
    <>
      <h1>{divisionPost.parentId ? 'Redigera sida' : 'Skapa sida'}</h1>
      <Divider />
      <h2>Skapa under</h2>
      <DropdownList onChange={(e) => setPage(+e.target.value)}>
        <option value={undefined}>Toppnivå</option>
        {divisionPost.pages.map((p) => {
          const pad = '\u00A0'.repeat(p.depth);
          return (
            <option key={p.id} value={p.id}>
              {`${pad}${p.titleSv}`}
            </option>
          );
        })}
      </DropdownList>

      <br />
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
        <ActionButton onClick={undefined}>
          {divisionPost.parentId !== undefined ? 'Redigera' : 'Skapa'}
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

export default DivisionPageForm;
