'use client';

import { edit, post, postForGroup } from '../../actions/newsPosts';
import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import { GammaGroup } from '@/types/gamma';
import { useState } from 'react';
import DropdownList from '../DropdownList/DropdownList';
import { marked } from 'marked';
import style from './NewsPostForm.module.scss';
import markdownStyle from '@/components/MarkdownView/MarkdownView.module.scss';
import Popup from 'reactjs-popup';
import DatePicker from '../DatePicker/DatePicker';
import i18nService from '@/services/i18nService';
import FileService from '@/services/fileService';
import ContentPane from '../ContentPane/ContentPane';

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
  locale: string;
  connectedEvents?: Event[];
}

interface Event {
  titleEn: string;
  titleSv: string;
  start: Date;
  end: Date;
  fullDay: boolean;
  location: string;
  id?: number;
}

const emptyEvent: Event = {
  titleEn: '',
  titleSv: '',
  start: new Date(),
  end: new Date(),
  fullDay: false,
  location: '',
  id: undefined
};

const NewsPostForm = (newsPost: NewPostFormProps) => {
  marked.use({
    pedantic: false,
    breaks: true,
    gfm: true
  });

  const l = i18nService.getLocale(newsPost.locale);

  const [group, setGroup] = useState(newsPost.group ?? 'self');
  const [titleEn, setTitleEn] = useState(newsPost.titleEn ?? '');
  const [titleSv, setTitleSv] = useState(newsPost.titleSv ?? '');
  const [contentEn, setContentEn] = useState(newsPost.contentEn ?? '');
  const [contentSv, setContentSv] = useState(newsPost.contentSv ?? '');
  const [publish, setPublish] = useState('now');
  const [scheduledFor, setScheduledFor] = useState(new Date());
  const [showPreview, setShowPreview] = useState(false);
  const [previewContentSv, setPreviewContentSv] = useState({
    __html: marked.parse('')
  });
  const [previewContentEn, setPreviewContentEn] = useState({
    __html: marked.parse('')
  });
  const [uploadQueue, setUploadQueue] = useState<{
    [key: string]: File;
  }>({});

  const [events, setEvents] = useState<Event[]>(newsPost.connectedEvents ?? []);

  const dropFile = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    let newQueue = { ...uploadQueue };
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!FileService.checkValidFile(file)) continue;

      const sha256 = await FileService.fileSha256Browser(file);
      newQueue[sha256] = file;
    }
    setUploadQueue(newQueue);
  };

  const delFile = (sha256: string) => {
    const newQueue = { ...uploadQueue };
    delete newQueue[sha256];
    setUploadQueue(newQueue);
  };

  const copyFile = (sha256: string) => {
    navigator.clipboard.writeText('[Text](/api/media/' + sha256 + ')');
  };

  const replaceLocalFiles = (text: string) => {
    let newText = text;
    for (const [sha256, file] of Object.entries(uploadQueue)) {
      newText = newText.replace(
        '(/api/media/' + sha256 + ')',
        '(' + URL.createObjectURL(file) + ')'
      );
    }

    return newText;
  };

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
        let formData = new FormData();
        for (const file of Object.values(uploadQueue)) {
          formData.append('file', file);
        }
        await post(
          titleEn,
          titleSv,
          contentEn,
          contentSv,
          formData,
          publishDate
        );
      }
    } catch {
      console.log('Failed to post news article');
    }
  }

  function preview() {
    const markupSv = marked.parse(replaceLocalFiles(contentSv));
    setPreviewContentSv({ __html: markupSv });
    const markupEn = marked.parse(replaceLocalFiles(contentEn));
    setPreviewContentEn({ __html: markupEn });

    setShowPreview(true);
  }

  return (
    <>
      <h1>{newsPost.id ? l.news.edit : l.news.create}</h1>
      <Divider />
      <h2>{l.editor.createAs}</h2>
      <DropdownList onChange={(e) => setGroup(e.target.value)}>
        <option value="self">{l.editor.self}</option>
        {newsPost.groups.map((group) => (
          <option key={group.superGroup!.id} value={group.superGroup!.id}>
            {group.superGroup?.prettyName ?? group.prettyName}
          </option>
        ))}
      </DropdownList>

      <h2>{l.editor.title} (Eng)</h2>
      <TextArea value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      <h2>{l.editor.content} (Eng)</h2>
      <MarkdownEditor
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={dropFile}
        value={contentEn}
        onChange={(e) => setContentEn(e.target.value)}
      />

      <h2>{l.editor.title} (Sv)</h2>
      <TextArea value={titleSv} onChange={(e) => setTitleSv(e.target.value)} />
      <h2>{l.editor.content} (Sv)</h2>
      <MarkdownEditor
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={dropFile}
        value={contentSv}
        onChange={(e) => setContentSv(e.target.value)}
      />
      <br />
      <h2>{l.editor.uploaded}</h2>
      {Object.keys(uploadQueue).length === 0 && <p>{l.editor.noFiles}</p>}
      <ul>
        {Object.entries(uploadQueue).map(([sha256, file]) => (
          <li className={style.fileActions} key={sha256}>
            <p>{file.name}</p>{' '}
            <ActionButton
              onClick={() => {
                copyFile(sha256);
              }}
            >
              {l.editor.copyLink}
            </ActionButton>{' '}
            <ActionButton
              onClick={() => {
                delFile(sha256);
              }}
            >
              {l.general.delete}
            </ActionButton>
          </li>
        ))}
      </ul>

      <br />
      <h2>{l.editor.publish}</h2>
      <div className={style.actions}>
        <DropdownList onChange={(e) => setPublish(e.target.value)}>
          <option value="now">{l.editor.now}</option>
          <option value="schedule">{l.editor.scheduled}</option>
        </DropdownList>
        <DatePicker
          hidden={publish === 'now'}
          value={scheduledFor}
          onChange={(e) => setScheduledFor(e)}
        />
      </div>

      <br />
      <h2>Events</h2>

      {events.map((e, i) => (
        <>
          <h2 key={i}>{l.editor.title} (Eng)</h2>
          <TextArea
            value={e.titleEn}
            onChange={(e) => {
              const newEvents = [...events];
              newEvents[i].titleEn = e.target.value;
              setEvents(newEvents);
            }}
          />

          <h2 key={i}>{l.editor.title} (Sv)</h2>
          <TextArea
            value={e.titleSv}
            onChange={(e) => {
              const newEvents = [...events];
              newEvents[i].titleSv = e.target.value;
              setEvents(newEvents);
            }}
          />

          <h2>Start</h2>
          <DatePicker
            key={i}
            value={e.start}
            onChange={(d) => {
              const newEvents = [...events];
              newEvents[i].start = d;
              setEvents(newEvents);
            }}
          />
          <h2>End</h2>
          <DatePicker
            key={i}
            disabled={e.fullDay}
            value={e.end}
            onChange={(d) => {
              const newEvents = [...events];
              newEvents[i].end = d;
              setEvents(newEvents);
            }}
          />
          <br />
          <label key={i} htmlFor={'fullDay' + i}>
            Full day event{' '}
          </label>
          <input
            key={i}
            type="checkbox"
            id={'fullDay' + i}
            name="fullDay"
            checked={e.fullDay}
            onChange={(e) => {
              const newEvents = [...events];
              newEvents[i].fullDay = e.target.checked;
              setEvents(newEvents);
            }}
          />
          <h2>Location</h2>
          <TextArea
            key={i}
            value={e.location}
            onChange={(e) => {
              const newEvents = [...events];
              newEvents[i].location = e.target.value;
              setEvents(newEvents);
            }}
          />

          <ActionButton
            key={i}
            onClick={() => {
              const newEvents = [...events];
              newEvents.splice(i, 1);
              setEvents(newEvents);
            }}
          >
            Delete Event
          </ActionButton>
        </>
      ))}

      <br />
      <ActionButton
        onClick={() => {
          setEvents([...events, { ...emptyEvent }]);
        }}
      >
        Add Event
      </ActionButton>

      <br />
      <div className={style.actions}>
        <ActionButton onClick={send}>
          {newsPost.id !== undefined ? l.general.edit : l.general.create}
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
        <ContentPane className={style.dialog}>
          <h1>{l.editor.preview}</h1>
          <Divider />
          <h1>{titleEn}</h1>
          <div
            className={markdownStyle.content}
            dangerouslySetInnerHTML={previewContentEn}
          />

          <Divider />

          <h1>{titleSv}</h1>
          <div
            className={markdownStyle.content}
            dangerouslySetInnerHTML={previewContentSv}
          />

          <ActionButton onClick={() => setShowPreview(false)}>
            {l.general.close}
          </ActionButton>
        </ContentPane>
      </Popup>
    </>
  );
};

export default NewsPostForm;
