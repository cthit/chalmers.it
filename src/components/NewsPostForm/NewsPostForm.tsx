'use client';

import { edit, post, postForGroup } from './actions';
import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import { GammaGroup } from '@/types/gamma';
import { useState } from 'react';
import DropdownList from '../DropdownList/DropdownList';
import { marked } from 'marked';
import style from './NewsPostForm.module.scss';
import Popup from 'reactjs-popup';

const PreviewContentStyle = {
  backgroundColor: '#000000AA'
};

interface NewPostFormProps {
  groups: GammaGroup[];
  id?: number;
  group?: string;
  titleEn?: string;
  titleSv?: string;
  contentEn?: string;
  contentSv?: string;
  writtenByGammaUserId?: string;
}

const NewsPostForm = (newsPost: NewPostFormProps) => {
  marked.use({
    pedantic: false,
    breaks: true,
    gfm: true
  });

  const [group, setGroup] = useState(newsPost.group ?? 'self');
  const [titleEn, setTitleEn] = useState(newsPost.titleEn ?? '');
  const [titleSv, setTitleSv] = useState(newsPost.titleSv ?? '');
  const [contentEn, setContentEn] = useState(newsPost.contentEn ?? '');
  const [contentSv, setContentSv] = useState(newsPost.contentSv ?? '');
  const [publish, setPublish] = useState('now');
  const [scheduledFor, setScheduledFor] = useState(Date.now().toString());
  const [showPreview, setShowPreview] = useState(false);
  const [previewContentSv, setPreviewContentSv] = useState({
    __html: marked.parse('')
  });
  const [previewContentEn, setPreviewContentEn] = useState({
    __html: marked.parse('')
  });

  async function send() {
    try {
      const publishDate =
        publish === 'now' ? undefined : new Date(scheduledFor);
      if (newsPost.id !== undefined) {
        await edit(
          newsPost.id!,
          newsPost.writtenByGammaUserId!,
          titleEn,
          titleSv,
          contentEn,
          contentSv,
          publishDate
        );
        return;
      }

      if (group !== 'self') {
        await postForGroup(
          titleEn,
          titleSv,
          contentEn,
          contentSv,
          group,
          publishDate
        );
        return;
      } else {
        await post(titleEn, titleSv, contentEn, contentSv, publishDate);
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
      <h1>{newsPost.id ? 'Redigera nyhet' : 'Skapa nyhet'}</h1>
      <Divider />
      <h2>Posta som</h2>
      <DropdownList onChange={(e) => setGroup(e.target.value)}>
        <option value="self">Mig själv</option>
        {newsPost.groups.map((group) => (
          <option key={group.superGroup!.id} value={group.superGroup!.id}>
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
      <h2>Publiceringstid</h2>
      <div className={style.actions}>
        <DropdownList onChange={(e) => setPublish(e.target.value)}>
          <option value="now">Nu</option>
          <option value="schedule">Schemalägg</option>
        </DropdownList>
        <input
          disabled={publish === 'now'}
          type="datetime-local"
          value={scheduledFor}
          onChange={(e) => setScheduledFor(e.target.value)}
        />
      </div>

      <br />
      <div className={style.actions}>
        <ActionButton onClick={send}>
          {newsPost.id !== undefined ? 'Redigera' : 'Skapa'}
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

export default NewsPostForm;
