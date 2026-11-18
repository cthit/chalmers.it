'use client';

import { createEvent, deleteEvent, editEvent } from '@/actions/events';
import { edit, post, postForGroup } from '@/actions/newsPosts';
import ActionButton from '@/components/ActionButton/ActionButton';
import Divider from '@/components/Divider/Divider';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import MediaUploader from '@/components/MediaUploader/MediaUploader';
import SegmentedControl from '@/components/SegmentedControl/SegmentedControl';
import TextArea from '@/components/TextArea/TextArea';
import { useUploadQueue } from '@/hooks/useUploadQueue';
import FileService from '@/services/fileService';
import i18nService from '@/services/i18nService';
import { GammaGroup } from '@/types/gamma';
import { marked } from 'marked';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker, {
  convertToDateTimeLocalString
} from '../DatePicker/DatePicker';
import DropdownList from '../DropdownList/DropdownList';
import style from './NewsPostForm.module.scss';
import { capitalize } from '@/utils/strings';
import { EventLanguage } from '@prisma/client';

const LOCAL_DRAFT_KEY_PREFIX = 'newsPostDraft';

marked.use({
  pedantic: false,
  breaks: true,
  gfm: true
});

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
  draftId?: string;
  open?: boolean;
}

interface DraftEvent extends Omit<Event, 'startTime' | 'endTime'> {
  startTime: string;
  endTime: string;
}

interface NewsPostDraft {
  titleEn: string;
  titleSv: string;
  contentEn: string;
  contentSv: string;
  group: string;
  publish: string;
  scheduledFor: string;
  events: DraftEvent[];
  removeQueue: number[];
  postId?: number;
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
  id: undefined,
  draftId: undefined,
  open: true
};

const EventField = ({
  id,
  label,
  children
}: {
  id: string;
  label: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className={style.eventField}>
    <label className={style.eventLabel} htmlFor={id}>
      {label}
    </label>
    {children}
  </div>
);

function createEventId() {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getEventKey(event: Event) {
  return event.draftId ?? `event-${event.id}`;
}

function eventToDraft(event: Event): DraftEvent {
  return {
    id: event.id,
    titleEn: event.titleEn,
    titleSv: event.titleSv,
    descriptionEn: event.descriptionEn,
    descriptionSv: event.descriptionSv,
    startTime: event.startTime.toISOString(),
    endTime: event.endTime.toISOString(),
    fullDay: event.fullDay,
    location: event.location,
    language: event.language
  };
}

function draftToEvent(event: DraftEvent): Event | null {
  if (!event?.startTime || !event?.endTime) return null;

  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
    return null;
  }

  return {
    titleEn: event.titleEn ?? '',
    titleSv: event.titleSv ?? '',
    descriptionEn: event.descriptionEn ?? '',
    descriptionSv: event.descriptionSv ?? '',
    startTime,
    endTime,
    fullDay: event.fullDay ?? false,
    location: event.location ?? null,
    language: event.language ?? null,
    id: event.id
  };
}

function parseDraftDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function makeDraft(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  group: string,
  publish: string,
  scheduledFor: Date,
  events: Event[],
  removeQueue: number[],
  postId?: number
): NewsPostDraft {
  return {
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    group,
    publish,
    scheduledFor: scheduledFor.toISOString(),
    events: events.map(eventToDraft),
    removeQueue,
    postId
  };
}

const NewsPostForm = (newsPost: NewPostFormProps) => {
  const l = i18nService.getLocale(newsPost.locale);
  const router = useRouter();
  const maxFileSizeBytes =
    newsPost.maxFileSizeBytes ?? FileService.maxMediaSizeBytes;
  const maxUploadSizeBytes =
    newsPost.maxUploadSizeBytes ?? FileService.maxUploadSizeBytes;
  const { uploadQueue, dropFiles, removeFile } = useUploadQueue({
    locale: newsPost.locale,
    maxFileSizeBytes,
    maxUploadSizeBytes
  });

  const draftKey =
    newsPost.id !== undefined
      ? `${LOCAL_DRAFT_KEY_PREFIX}:edit:${newsPost.id}`
      : `${LOCAL_DRAFT_KEY_PREFIX}:new`;
  const [initialScheduledFor] = useState(
    () => newsPost.scheduledPublish ?? new Date()
  );
  const [serverDraftJson] = useState(() =>
    JSON.stringify(
      makeDraft(
        newsPost.titleEn ?? '',
        newsPost.titleSv ?? '',
        newsPost.contentEn ?? '',
        newsPost.contentSv ?? '',
        newsPost.group ?? '',
        newsPost.scheduledPublish ? 'schedule' : 'now',
        initialScheduledFor,
        newsPost.connectedEvents ?? [],
        [],
        newsPost.id
      )
    )
  );
  const [draft] = useState(loadDraft);
  const [draftRestored, setDraftRestored] = useState(
    () => draft !== null && JSON.stringify(draft) !== serverDraftJson
  );
  const [submitted, setSubmitted] = useState(false);

  const [activeLanguage, setActiveLanguage] = useState<'en' | 'sv'>(
    newsPost.locale === 'en' ? 'en' : 'sv'
  );

  const [group, setGroup] = useState(newsPost.group ?? draft?.group ?? '');
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
  const [publish, setPublish] = useState(
    newsPost.scheduledPublish === null
      ? 'now'
      : draft?.publish === 'schedule' || draft?.publish === 'now'
        ? draft.publish
        : newsPost.scheduledPublish
          ? 'schedule'
          : 'now'
  );
  const [scheduledFor, setScheduledFor] = useState(
    parseDraftDate(draft?.scheduledFor, initialScheduledFor)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<number | undefined>(
    newsPost.id ?? draft?.postId
  );

  const [events, setEvents] = useState<Event[]>(() => {
    const source = draft?.events
      ? draft.events
          .map(draftToEvent)
          .filter((event): event is Event => event !== null)
      : (newsPost.connectedEvents ?? []);

    return source.map((event) => ({
      ...event,
      draftId:
        event.draftId ?? (event.id === undefined ? createEventId() : undefined)
    }));
  });
  const [removeQueue, setRemoveQueue] = useState<number[]>(
    draft?.removeQueue ?? []
  );

  useEffect(() => {
    if (submitted) return;

    try {
      const currentDraft = makeDraft(
        titleEn,
        titleSv,
        contentEn,
        contentSv,
        group,
        publish,
        scheduledFor,
        events,
        removeQueue,
        createdPostId
      );

      if (JSON.stringify(currentDraft) === serverDraftJson) {
        localStorage.removeItem(draftKey);
        setDraftRestored(false);
      } else {
        localStorage.setItem(draftKey, JSON.stringify(currentDraft));
      }
    } catch {}
  }, [
    draftKey,
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    group,
    publish,
    scheduledFor,
    events,
    removeQueue,
    createdPostId,
    submitted,
    serverDraftJson
  ]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const queuedFiles = Object.values(uploadQueue);
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
      const existingPostId = newsPost.id ?? createdPostId;
      let postId: number;

      if (existingPostId !== undefined) {
        await toast.promise(
          edit(
            existingPostId,
            titleEn,
            titleSv,
            contentEn,
            contentSv,
            formData,
            publish === 'now' ? null : publishDate
          ),
          {
            pending: l.editor.saving,
            success: l.editor.saved,
            error: l.editor.saveError
          }
        );
        postId = existingPostId;
      } else if (group !== 'self') {
        postId = await toast.promise(
          postForGroup(
            titleEn,
            titleSv,
            contentEn,
            contentSv,
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
            contentEn,
            contentSv,
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

      setCreatedPostId(postId);

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
      setSubmitted(true);
      clearDraft();
      router.push(`/post/${postId}`);
    } catch {
      console.log('Failed to post news article');
    } finally {
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

  function setEventOpen(i: number, open: boolean) {
    setEvents((prevEvents) =>
      prevEvents.map((event, index) =>
        index === i ? { ...event, open } : event
      )
    );
  }

  function loadDraft(): NewsPostDraft | null {
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

  function discardDraft() {
    setSubmitted(true);
    clearDraft();
    window.location.reload();
  }

  function cancel() {
    const postId = newsPost.id ?? createdPostId;
    router.push(postId !== undefined ? `/post/${postId}` : '/');
  }

  const languageOrder: ('en' | 'sv')[] =
    newsPost.locale === 'en' ? ['en', 'sv'] : ['sv', 'en'];

  const languageLabel = (language: 'en' | 'sv') =>
    capitalize(l.events.languages[language]);

  const isLanguageComplete = (language: 'en' | 'sv') =>
    language === 'en'
      ? titleEn.trim() !== '' && contentEn.trim() !== ''
      : titleSv.trim() !== '' && contentSv.trim() !== '';

  const eventTitle = (event: Event) =>
    (newsPost.locale === 'en' ? event.titleEn : event.titleSv) ||
    event.titleEn ||
    event.titleSv ||
    l.events.untitled;

  const isEditing =
    newsPost.id !== undefined || createdPostId !== undefined;

  const languageToggle = (
    <SegmentedControl
      value={activeLanguage}
      ariaLabel={l.events.language}
      className={style.languageToggle}
      options={languageOrder.map((language) => {
        const complete = isLanguageComplete(language);
        const label = languageLabel(language);
        const status = complete
          ? l.editor.languageComplete
          : l.editor.languageIncomplete;
        return {
          value: language,
          label: (
            <>
              {language.toUpperCase()}
              <span
                className={`${style.languageStatus} ${
                  complete ? '' : style.languageIncomplete
                }`}
                aria-hidden="true"
              >
                {complete ? '✓' : '•'}
              </span>
            </>
          ),
          ariaLabel: `${label} ${status}`,
          title: `${label} ${status}`
        };
      })}
      onChange={(language) => setActiveLanguage(language as 'en' | 'sv')}
    />
  );

  return (
    <>
      <h1>{isEditing ? l.news.edit : l.news.create}</h1>
      <Divider />
      <form onSubmit={send} aria-busy={isSubmitting}>
        <h2>{l.editor.createAs}</h2>
        <label className={style.srOnly} htmlFor="news-post-group">
          {l.editor.createAs}
        </label>
        <DropdownList
          id="news-post-group"
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

        <h2>{l.editor.title}</h2>
        <div className={style.titleFields}>
          {languageOrder.map((language) => (
            <label className={style.titleField} key={language}>
              <span>{languageLabel(language)}</span>
              <TextArea
                value={language === 'en' ? titleEn : titleSv}
                onChange={(e) =>
                  language === 'en'
                    ? setTitleEn(e.target.value)
                    : setTitleSv(e.target.value)
                }
                required
              />
            </label>
          ))}
        </div>

        <h2>{l.editor.content}</h2>
        {languageOrder.map((language) => (
          <div key={language} hidden={activeLanguage !== language}>
            <MarkdownEditor
              value={language === 'en' ? contentEn : contentSv}
              onUpload={dropFiles}
              onChange={language === 'en' ? setContentEn : setContentSv}
              locale={newsPost.locale}
              localFiles={uploadQueue}
              toolbarStart={languageToggle}
              ariaLabel={`${l.editor.content} ${languageLabel(language)}`}
            />
          </div>
        ))}
        <MediaUploader
          locale={newsPost.locale}
          uploadQueue={uploadQueue}
          onSelect={dropFiles}
          onRemove={removeFile}
          maxFileSizeBytes={maxFileSizeBytes}
          maxUploadSizeBytes={maxUploadSizeBytes}
        />

        <h2>{l.editor.publish}</h2>
        <div className={style.actions}>
          <SegmentedControl
            value={publish}
            ariaLabel={l.editor.publish}
            className={style.publishToggle}
            options={[
              { value: 'now', label: l.editor.now },
              {
                value: 'schedule',
                label: l.editor.scheduled,
                disabled: newsPost.scheduledPublish === null
              }
            ]}
            onChange={setPublish}
          />
          <label className={style.srOnly} htmlFor="news-post-scheduled-for">
            {l.editor.scheduled}
          </label>
          <DatePicker
            id="news-post-scheduled-for"
            hidden={publish === 'now'}
            required={publish === 'schedule'}
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e)}
          />
        </div>

        <br />
        <h2>{l.events.events}</h2>

        {events.length === 0 ? (
          <p>{l.events.empty}</p>
        ) : (
          <ul className={style.eventList}>
            {events.map((e, i) => {
              const eventKey = getEventKey(e);
              return (
                <li key={eventKey} className={style.eventCardItem}>
                  <details
                    className={style.eventCard}
                    open={e.open ?? e.id === undefined}
                    onToggle={(event) =>
                      setEventOpen(i, event.currentTarget.open)
                    }
                  >
                    <summary className={style.eventSummary}>
                      <span className={style.eventSummaryContent}>
                        <span
                          className={style.eventTitle}
                          role="heading"
                          aria-level={3}
                        >
                          {eventTitle(e)}
                        </span>
                        <span className={style.eventDate}>
                          {i18nService.formatDate(e.startTime)}
                        </span>
                      </span>
                    </summary>
                    <div className={style.eventBody}>
                      <EventField
                        id={`event-title-en-${eventKey}`}
                        label={`${l.editor.title} (${languageLabel('en')})`}
                      >
                        <TextArea
                          id={`event-title-en-${eventKey}`}
                          value={e.titleEn}
                          onChange={(ev) =>
                            editEventState(i, 'titleEn', ev.target.value)
                          }
                          required
                        />
                      </EventField>
                      <EventField
                        id={`event-title-sv-${eventKey}`}
                        label={`${l.editor.title} (${languageLabel('sv')})`}
                      >
                        <TextArea
                          id={`event-title-sv-${eventKey}`}
                          value={e.titleSv}
                          onChange={(ev) =>
                            editEventState(i, 'titleSv', ev.target.value)
                          }
                          required
                        />
                      </EventField>
                      <EventField
                        id={`event-start-${eventKey}`}
                        label={l.events.start}
                      >
                        <DatePicker
                          id={`event-start-${eventKey}`}
                          required
                          value={e.startTime}
                          onChange={(d) =>
                            handleEventDateChange(i, 'startTime', d)
                          }
                        />
                      </EventField>
                      <EventField
                        id={`event-end-${eventKey}`}
                        label={l.events.end}
                      >
                        <DatePicker
                          id={`event-end-${eventKey}`}
                          disabled={e.fullDay}
                          required
                          value={e.endTime}
                          min={
                            e.startTime
                              ? convertToDateTimeLocalString(e.startTime)
                              : undefined
                          }
                          onChange={(d) =>
                            handleEventDateChange(i, 'endTime', d)
                          }
                        />
                      </EventField>
                      <label
                        className={style.eventCheckbox}
                        htmlFor={`event-full-day-${eventKey}`}
                      >
                        <input
                          type="checkbox"
                          id={`event-full-day-${eventKey}`}
                          checked={e.fullDay}
                          onChange={(ev) =>
                            editEventState(i, 'fullDay', ev.target.checked)
                          }
                        />
                        {l.events.fullDay}
                      </label>
                      <EventField
                        id={`event-location-${eventKey}`}
                        label={l.events.location}
                      >
                        <TextArea
                          id={`event-location-${eventKey}`}
                          value={e.location ?? ''}
                          onChange={(ev) =>
                            editEventState(i, 'location', ev.target.value)
                          }
                        />
                      </EventField>
                      <EventField
                        id={`event-language-${eventKey}`}
                        label={l.events.language}
                      >
                        <DropdownList
                          id={`event-language-${eventKey}`}
                          value={e.language?.toString() ?? ''}
                          onChange={(ev) =>
                            editEventState(
                              i,
                              'language',
                              ev.target.value === ''
                                ? null
                                : EventLanguage[
                                    ev.target.value as EventLanguage
                                  ]
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
                      </EventField>
                    </div>
                    <div className={style.eventFooter}>
                      <ActionButton
                        type="button"
                        variant="secondary"
                        onClick={() => removeEventState(i, e.id)}
                      >
                        {l.events.remove}
                      </ActionButton>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}

        <ActionButton
          type="button"
          onClick={() => {
            setEvents([...events, { ...emptyEvent, draftId: createEventId() }]);
          }}
        >
          {l.events.add}
        </ActionButton>

        <div className={style.saveBar}>
          {draftRestored && (
            <div className={style.saveStatus}>
              <span role="status">{l.editor.draftRestored}</span>
              <button
                type="button"
                className={style.linkButton}
                disabled={isSubmitting}
                onClick={discardDraft}
              >
                {l.editor.discardDraft}
              </button>
            </div>
          )}
          <div className={style.saveActions}>
            <ActionButton
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={cancel}
            >
              {l.editor.cancel}
            </ActionButton>
            <ActionButton type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? l.editor.saving
                  : l.editor.posting
                : isEditing
                  ? l.general.save
                  : l.general.create}
            </ActionButton>
          </div>
        </div>
      </form>
    </>
  );
};

export default NewsPostForm;
