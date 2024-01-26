'use client';

import { edit, post, postForGroup } from './actions';
import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import { GammaGroup } from '@/models/GammaModels';
import { useState } from 'react';
import DropdownList from '../DropdownList/DropdownList';
import { marked } from 'marked';
import style from './NewsPostForm.module.scss';

interface NewPostFormProps {
  groups: GammaGroup[];
  id?: number;
  group?: string;
  titleEn?: string;
  titleSv?: string;
  contentEn?: string;
  contentSv?: string;
}

const NewsPostForm = (newsPost: NewPostFormProps) => {
  const [group, setGroup] = useState(newsPost.group ?? 'self');
  const [titleEn, setTitleEn] = useState(newsPost.titleEn ?? '');
  const [titleSv, setTitleSv] = useState(newsPost.titleSv ?? '');
  const [contentEn, setContentEn] = useState(newsPost.contentEn ?? '');
  const [contentSv, setContentSv] = useState(newsPost.contentSv ?? '');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContentSv, setPreviewContentSv] = useState({
    __html: marked.parse('')
  });
  const [previewContentEn, setPreviewContentEn] = useState({
    __html: marked.parse('')
  });

  async function send() {
    try {
      console.log("ID", newsPost.id);
      if (newsPost.id !== undefined) {
        await edit(newsPost.id!, titleEn, titleSv, contentEn, contentSv);
        return;
      }

      if (group !== 'self') {
        await postForGroup(titleEn, titleSv, contentEn, contentSv, group);
        return;
      } else {
        await post(titleEn, titleSv, contentEn, contentSv);
      }
    } catch {
      console.log('Failed to post news article');
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
      <h1>Skapa nyhet</h1>
      <Divider />
      <h2>Posta som</h2>
      <DropdownList onChange={(e) => setGroup(e.target.value)}>
        <option value="self">Mig själv</option>
        {newsPost.groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.superGroup?.prettyName ?? group.prettyName}
          </option>
        ))}
      </DropdownList>

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
        <ActionButton onClick={send}>{newsPost.id !== undefined ? "Redigera" : "Skapa"}</ActionButton>
        <ActionButton onClick={preview}>Förhandsgranska</ActionButton>
      </div>

      <dialog className={style.dialog} open={showPreview}>
        <h1>Förhandsgranskning</h1>
        <Divider />
        <h2>{titleSv}</h2>
        <p dangerouslySetInnerHTML={previewContentSv} />
        <Divider />
        <h2>{titleEn}</h2>
        <p dangerouslySetInnerHTML={previewContentEn} />

        <form method="dialog">
          <ActionButton onClick={() => setShowPreview(false)}>
            Stäng
          </ActionButton>
        </form>
      </dialog>
    </>
  );
};

export default NewsPostForm;
