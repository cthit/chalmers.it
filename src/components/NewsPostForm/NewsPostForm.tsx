'use client';

import { createEvent, deleteEvent, editEvent } from '@/actions/events';
import { edit, post, postForGroup } from '@/actions/newsPosts';
import ActionButton from '@/components/ActionButton/ActionButton';
import Divider from '@/components/Divider/Divider';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import FileService, { MediaType } from '@/services/fileService';
import i18nService from '@/services/i18nService';
import { GammaGroup } from '@/types/gamma';
import { marked } from 'marked';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CopyButton from '../CopyButton/CopyButton';
import DatePicker, {
  convertToDateTimeLocalString
} from '../DatePicker/DatePicker';
import DropdownList from '../DropdownList/DropdownList';
import style from './NewsPostForm.module.scss';
import { createMarkdownLinkToMedia } from '@/utils/mediaLink';
import { capitalize } from '@/utils/strings';
import { EventLanguage } from '@prisma/client';

const validUploadTypes = Object.values(MediaType);

const LOCAL_DRAFT_KEY_PREFIX = 'newsPostDraft';

const LARGE_IMAGE_WARNING_BYTES = 2 * 1024 * 1024;
const VERY_LARGE_FILE_WARNING_BYTES = 10 * 1024 * 1024;

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
  scheduledPublish?: Date | null;
  connectedEvents?: Event[];
  maxFileSizeBytes?: number;
  maxUploadSizeBytes?: number;
}

interface Event {
  titleEn: string;
  titleSv: string;
  descriptionEn: string;
  descriptionSv: string;
  startTime: Date;
  endTime: Date;
  fullDay: boolean;
  location: string | null;
  language: EventLanguage | null;
  id?: number;
}

interface EventDraft {
  titleEn: string;
  titleSv: string;
  contentEn: string;
  contentSv: string;
}

const emptyEvent: Event = {
  titleEn: '',
  titleSv: '',
  descriptionEn: '',
  descriptionSv: '',
  startTime: new Date(),
  endTime: new Date(),
  fullDay: false,
  location: '',
  language: null,
  id: undefined
};

const NewsPostForm = (newsPost: NewPostFormProps) => {
  marked.use({
    pedantic: false,
    breaks: true,
    gfm: true
  });

  const l = i18nService.getLocale(newsPost.locale);
  const router = useRouter();
  const maxFileSizeBytes =
    newsPost.maxFileSizeBytes ?? FileService.maxMediaSizeBytes;
  const maxUploadSizeBytes =
    newsPost.maxUploadSizeBytes ?? FileService.maxUploadSizeBytes;

  const draftKey =
    newsPost.id !== undefined
      ? `${LOCAL_DRAFT_KEY_PREFIX}:edit:${newsPost.id}`
      : `${LOCAL_DRAFT_KEY_PREFIX}:new`;
  const [draft] = useState(loadDraft);
  const submitted = useRef(false);

  const [group, setGroup] = useState(newsPost.group ?? '');
  const [titleEn, setTitleEn] = useState(
    draft?.titleEn ?? newsPost.titleEn ?? ''
  );
  const [titleSv, setTitleSv] = useState(
    draft?.titleSv ?? newsPost.titleSv ?? ''
  );
  const [contentEn, setContentEn] = useState(
    draft?.contentEn ?? newsPost.contentEn ?? ''
  );
  const [contentSv, setContentSv] = useState(
    draft?.contentSv ?? newsPost.contentSv ?? ''
  );
  const contentEnRef = useRef<{ getMarkdown: () => string }>(null);
  const contentSvRef = useRef<{ getMarkdown: () => string }>(null);
  const [publish, setPublish] = useState(
    newsPost.scheduledPublish ? 'schedule' : 'now'
  );
  const [scheduledFor, setScheduledFor] = useState(
    newsPost.scheduledPublish ?? new Date()
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<{
    [key: string]: File;
  }>({});
  const uploadQueueRef = useRef<{ [key: string]: File }>(uploadQueue);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const createdPostIdRef = useRef<number | undefined>(undefined);

  const [events, setEvents] = useState<Event[]>(newsPost.connectedEvents ?? []);
  const [removeQueue, setRemoveQueue] = useState<number[]>([]);

  useEffect(() => {
    if (submitted.current) return;

    const unchanged =
      titleEn === (newsPost.titleEn ?? '') &&
      titleSv === (newsPost.titleSv ?? '') &&
      contentEn === (newsPost.contentEn ?? '') &&
      contentSv === (newsPost.contentSv ?? '');

    try {
      if (unchanged) {
        localStorage.removeItem(draftKey);
      } else {
        localStorage.setItem(
          draftKey,
          JSON.stringify({ titleEn, titleSv, contentEn, contentSv })
        );
      }
    } catch {}
  }, [
    draftKey,
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    newsPost.titleEn,
    newsPost.titleSv,
    newsPost.contentEn,
    newsPost.contentSv
  ]);

  const dropFiles = async (f: FileList | File[]) => {
    const droppedFiles: { [key: string]: File } = {};
    const rejected: { file: File; reason: string }[] = [];

    for (const file of Array.from(f)) {
      const meta = FileService.convertMimeType(file.type);
      if (!meta || !validUploadTypes.includes(meta.type)) {
        rejected.push({ file, reason: l.editor.fileTypeUnsupported });
        continue;
      }

      if (file.size > maxFileSizeBytes) {
        rejected.push({
          file,
          reason: `${l.editor.fileTooLarge} (${FileService.formatBytes(maxFileSizeBytes)})`
        });
        continue;
      }

      const currentSize = Object.values(uploadQueueRef.current).reduce(
        (total, queued) => total + queued.size,
        0
      );
      if (currentSize + file.size > maxUploadSizeBytes) {
        rejected.push({
          file,
          reason: `${l.editor.uploadLimitExceeded} (${FileService.formatBytes(maxUploadSizeBytes)})`
        });
        continue;
      }

      if (file.size >= VERY_LARGE_FILE_WARNING_BYTES) {
        toast.warning(
          `${file.name}. ${
            meta.type === MediaType.Image
              ? l.editor.imageVeryLarge
              : l.editor.fileLarge
          }`
        );
      }

      const sha256 = await FileService.fileSha256Browser(file);
      if (uploadQueueRef.current[sha256]) {
        droppedFiles[sha256] = uploadQueueRef.current[sha256];
        continue;
      }

      // Re-check after hashing so concurrent drops cannot push the queue over
      // the limit.
      const latestSize = Object.values(uploadQueueRef.current).reduce(
        (total, queued) => total + queued.size,
        0
      );
      if (latestSize + file.size > maxUploadSizeBytes) {
        rejected.push({
          file,
          reason: `${l.editor.uploadLimitExceeded} (${FileService.formatBytes(maxUploadSizeBytes)})`
        });
        continue;
      }

      uploadQueueRef.current = {
        ...uploadQueueRef.current,
        [sha256]: file
      };
      setUploadQueue(uploadQueueRef.current);
      droppedFiles[sha256] = file;
    }

    if (rejected.length > 0) {
      toast.error(
        `${l.editor.uploadRejected}. ${rejected
          .map(({ file, reason }) => `${file.name} (${reason})`)
          .join(', ')}`
      );
    }

    return Object.entries(droppedFiles).map(([sha256, file]) => ({
      file,
      url: '/api/media/' + sha256
    }));
  };

  const delFile = (sha256: string) => {
    const newQueue = { ...uploadQueueRef.current };
    delete newQueue[sha256];
    uploadQueueRef.current = newQueue;
    setUploadQueue(newQueue);
  };

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const queuedFiles = Object.values(uploadQueueRef.current);
      const totalSize = queuedFiles.reduce(
        (total, file) => total + file.size,
        0
      );
      if (totalSize > maxUploadSizeBytes) {
        toast.error(
          `${l.editor.uploadLimitExceeded} (${FileService.formatBytes(
            maxUploadSizeBytes
          )})`
        );
        return;
      }

      const formData = new FormData();
      for (const file of queuedFiles) {
        formData.append('file', file);
      }
      const publishDate =
        publish === 'now' ? undefined : new Date(scheduledFor);
      let postId: number;

      if (newsPost.id !== undefined) {
        await toast.promise(
          edit(
            newsPost.id,
            titleEn,
            titleSv,
            contentEnRef.current!.getMarkdown(),
            contentSvRef.current!.getMarkdown(),
            formData,
            publish === 'now' ? null : publishDate
          ),
          {
            pending: l.editor.saving,
            success: l.editor.saved,
            error: l.editor.saveError
          }
        );
        postId = newsPost.id;
      } else if (createdPostIdRef.current !== undefined) {
        await toast.promise(
          edit(
            createdPostIdRef.current,
            titleEn,
            titleSv,
            contentEnRef.current!.getMarkdown(),
            contentSvRef.current!.getMarkdown(),
            formData,
            publish === 'now' ? null : publishDate
          ),
          {
            pending: l.editor.saving,
            success: l.editor.saved,
            error: l.editor.saveError
          }
        );
        postId = createdPostIdRef.current;
      } else if (group !== 'self') {
        postId = await toast.promise(
          postForGroup(
            titleEn,
            titleSv,
            contentEnRef.current!.getMarkdown(),
            contentSvRef.current!.getMarkdown(),
            group,
            formData,
            publishDate
          ),
          {
            pending: l.editor.posting,
            success: l.editor.posted,
            error: l.editor.postError
          }
        );
      } else {
        postId = await toast.promise(
          post(
            titleEn,
            titleSv,
            contentEnRef.current!.getMarkdown(),
            contentSvRef.current!.getMarkdown(),
            formData,
            publishDate
          ),
          {
            pending: l.editor.posting,
            success: l.editor.posted,
            error: l.editor.postError
          }
        );
      }

      createdPostIdRef.current = postId;

      const nextEvents = events.map((event) => ({ ...event }));
      try {
        for (let i = 0; i < nextEvents.length; i++) {
          const event = nextEvents[i];
          const data = {
            titleEn: event.titleEn,
            titleSv: event.titleSv,
            descriptionEn: event.descriptionEn,
            descriptionSv: event.descriptionSv,
            fullDay: event.fullDay,
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            language: event.language,
            newsPostId: postId
          };

          if (event.id === undefined) {
            const created = await createEvent(data);
            nextEvents[i] = { ...event, id: created.id };
          } else {
            await editEvent(event.id, data);
          }
        }

        const remainingRemovals: number[] = [];
        for (const id of removeQueue) {
          try {
            await deleteEvent(id);
          } catch {
            remainingRemovals.push(id);
          }
        }
        setRemoveQueue(remainingRemovals);
        if (remainingRemovals.length > 0) {
          throw new Error('Could not remove all connected events');
        }
      } catch {
        setEvents(nextEvents);
        toast.error(l.editor.eventSaveError);
        return;
      }

      setEvents(nextEvents);
      submitted.current = true;
      clearDraft();
      router.push(`/post/${postId}`);
    } catch {
      console.log('Failed to post news article');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function editEventState<K extends keyof Event>(
    id: number,
    key: K,
    value: Event[K]
  ) {
    setEvents((prevEvents) =>
      prevEvents.map((event, index) =>
        index === id ? { ...event, [key]: value } : event
      )
    );
  }

  // Handler for date pickers to ensure endTime >= startTime
  function handleEventDateChange(
    id: number,
    key: 'startTime' | 'endTime',
    value: Date
  ) {
    setEvents((prevEvents) => {
      const newEvents = [...prevEvents];
      const event = { ...newEvents[id] };
      let newStart = event.startTime;
      let newEnd = event.endTime;
      if (key === 'startTime') {
        newStart = value;
        if (newEnd < newStart) newEnd = newStart;
      } else if (key === 'endTime') {
        newEnd = value < newStart ? newStart : value;
      }
      event.startTime = newStart;
      event.endTime = newEnd;
      newEvents[id] = event;
      return newEvents;
    });
  }

  function removeEventState(i: number, id?: number) {
    const newEvents = [...events];
    newEvents.splice(i, 1);
    setEvents(newEvents);

    if (id !== undefined) {
      setRemoveQueue([...removeQueue, id]);
    }
  }

  function loadDraft(): EventDraft | null {
    try {
      const loaded = localStorage.getItem(draftKey);
      return loaded ? JSON.parse(loaded) : null;
    } catch {
      return null;
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(draftKey);
    } catch {}
  }

  const uploadedFiles = Object.entries(uploadQueue);
  const totalUploadSize = uploadedFiles.reduce(
    (total, [, file]) => total + file.size,
    0
  );

  const getFileWarning = (file: File) => {
    const isImage = FileService.isMimeEmbeddable(file.type);
    if (isImage && file.size >= VERY_LARGE_FILE_WARNING_BYTES) {
      return { message: l.editor.imageVeryLarge, severe: true };
    }
    if (isImage && file.size >= LARGE_IMAGE_WARNING_BYTES) {
      return { message: l.editor.imageLarge, severe: false };
    }
    if (file.size >= VERY_LARGE_FILE_WARNING_BYTES) {
      return { message: l.editor.fileLarge, severe: true };
    }
    return null;
  };

  return (
    <>
      <h1>{newsPost.id ? l.news.edit : l.news.create}</h1>
      <Divider />
      <form onSubmit={send} aria-busy={isSubmitting}>
        <h2>{l.editor.createAs}</h2>
        <DropdownList
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          disabled={newsPost.group !== undefined}
          required
        >
          <option disabled hidden={group !== ''} value="">
            {l.editor.selectGroup}
          </option>
          <option value="self">{l.editor.self}</option>
          {newsPost.groups.map((group) => (
            <option key={group.superGroup!.id} value={group.superGroup!.id}>
              {group.superGroup?.prettyName ?? group.prettyName}
            </option>
          ))}
        </DropdownList>

        <h2>{l.editor.title} (Eng)</h2>
        <TextArea
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          required
        />
        <h2>{l.editor.content} (Eng)</h2>
        <MarkdownEditor
          defaultMd={draft?.contentEn ?? newsPost.contentEn}
          ref={contentEnRef}
          onUpload={dropFiles}
          onChange={(contents) => {
            setContentEn(contents);
          }}
          locale={newsPost.locale}
          localFiles={uploadQueue}
        />

        <h2>{l.editor.title} (Sv)</h2>
        <TextArea
          value={titleSv}
          onChange={(e) => {
            setTitleSv(e.target.value);
          }}
          required
        />
        <h2>{l.editor.content} (Sv)</h2>
        <MarkdownEditor
          defaultMd={draft?.contentSv ?? newsPost.contentSv}
          ref={contentSvRef}
          onUpload={dropFiles}
          onChange={(contents) => {
            setContentSv(contents);
          }}
          locale={newsPost.locale}
          localFiles={uploadQueue}
        />
        <br />
        <h2>{l.editor.uploaded}</h2>
        {uploadedFiles.length === 0 ? (
          <p>{l.editor.noFiles}</p>
        ) : (
          <p
            className={`${style.uploadSummary} ${
              totalUploadSize > maxUploadSizeBytes * 0.9
                ? style.fileWarningStrong
                : ''
            }`}
          >
            {l.editor.totalSize} {FileService.formatBytes(totalUploadSize)} /{' '}
            {FileService.formatBytes(maxUploadSizeBytes)}
          </p>
        )}
        <ul>
          {uploadedFiles.map(([sha256, file]) => {
            const warning = getFileWarning(file);
            return (
              <li className={style.fileActions} key={sha256}>
                <p>{file.name}</p>{' '}
                <span className={style.fileSize}>
                  {FileService.formatBytes(file.size)}
                </span>
                <CopyButton
                  locale={newsPost.locale}
                  copyContent={createMarkdownLinkToMedia(sha256, file)}
                />
                <ActionButton
                  type="button"
                  onClick={() => {
                    delFile(sha256);
                  }}
                >
                  {l.general.delete}
                </ActionButton>
                {warning && (
                  <span
                    className={`${style.fileWarning} ${
                      warning.severe ? style.fileWarningStrong : ''
                    }`}
                  >
                    {warning.message}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <ActionButton
          type="button"
          onClick={() => fileInputRef.current!.click()}
        >
          {l.editor.selectFiles}
        </ActionButton>
        <p className={style.uploadSummary}>
          {l.editor.maxFileSize} {FileService.formatBytes(maxFileSizeBytes)}
          <br />
          {l.editor.maxTotalUploadSize}{' '}
          {FileService.formatBytes(maxUploadSizeBytes)}
        </p>
        <input
          accept={FileService.getValidMimes(validUploadTypes).join(',')}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = '';
            void dropFiles(files);
          }}
          multiple
          ref={fileInputRef}
          type="file"
          hidden
        />

        <br />
        <h2>{l.editor.publish}</h2>
        <div className={style.actions}>
          <DropdownList
            value={publish}
            onChange={(e) => setPublish(e.target.value)}
            required
          >
            <option value="now">{l.editor.now}</option>
            <option
              disabled={newsPost.scheduledPublish === null}
              value="schedule"
            >
              {l.editor.scheduled}
            </option>
          </DropdownList>
          <DatePicker
            hidden={publish === 'now'}
            required={publish === 'schedule'}
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e)}
          />
        </div>

        <br />
        <h2>{l.events.events}</h2>

        <ul>
          {events.map((e, i) => (
            <li key={i} className={style.listItem}>
              <h3>{l.editor.title} (Eng)</h3>
              <TextArea
                value={e.titleEn}
                onChange={(e) => editEventState(i, 'titleEn', e.target.value)}
                required
              />

              <h3>{l.editor.title} (Sv)</h3>
              <TextArea
                value={e.titleSv}
                onChange={(e) => editEventState(i, 'titleSv', e.target.value)}
                required
              />

              <h3>{l.events.start}</h3>
              <DatePicker
                required
                value={e.startTime}
                onChange={(d) => handleEventDateChange(i, 'startTime', d)}
              />
              <h3>{l.events.end}</h3>
              <DatePicker
                disabled={e.fullDay}
                required
                value={e.endTime}
                min={
                  e.startTime
                    ? convertToDateTimeLocalString(e.startTime)
                    : undefined
                }
                onChange={(d) => handleEventDateChange(i, 'endTime', d)}
              />
              <br />
              <label key={i} htmlFor={'fullDay' + i}>
                {l.events.fullDay}{' '}
              </label>
              <input
                type="checkbox"
                id={'fullDay' + i}
                name="fullDay"
                checked={e.fullDay}
                onChange={(e) => editEventState(i, 'fullDay', e.target.checked)}
              />
              <h3>{l.events.location}</h3>
              <TextArea
                value={e.location ?? ''}
                onChange={(e) => editEventState(i, 'location', e.target.value)}
              />

              <h3>{l.events.language}</h3>
              <div className={style.actions}>
                <DropdownList
                  value={e.language?.toString() ?? ''}
                  onChange={(e) =>
                    editEventState(
                      i,
                      'language',
                      e.target.value === ''
                        ? null
                        : EventLanguage[e.target.value as EventLanguage]
                    )
                  }
                >
                  <option value="">{l.general.notApplicable}</option>
                  <option value="SV">
                    {capitalize(l.events.languages.sv)}
                  </option>
                  <option value="EN">
                    {capitalize(l.events.languages.en)}
                  </option>
                  <option value="SV_EN">
                    {capitalize(l.events.languages.sv_en)}
                  </option>
                </DropdownList>
              </div>

              <br />
              <br />
              <ActionButton
                type="button"
                onClick={() => removeEventState(i, e.id)}
              >
                {l.events.remove}
              </ActionButton>
            </li>
          ))}
        </ul>

        {events.length === 0 ? (
          <p>{l.events.empty}</p>
        ) : (
          <>
            <br />
            <br />
          </>
        )}
        <ActionButton
          type="button"
          onClick={() => {
            setEvents([...events, { ...emptyEvent }]);
          }}
        >
          {l.events.add}
        </ActionButton>

        <br />
        <br />
        <div className={style.actions}>
          <ActionButton type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? newsPost.id !== undefined
                ? l.editor.saving
                : l.editor.posting
              : newsPost.id !== undefined
                ? l.general.save
                : l.general.create}
          </ActionButton>
        </div>
      </form>
    </>
  );
};

export default NewsPostForm;
