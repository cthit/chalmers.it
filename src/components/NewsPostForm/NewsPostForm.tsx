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
import { useState } from 'react';
import { toast } from 'react-toastify';
import { BsPlusLg } from 'react-icons/bs';
import DatePicker from '../DatePicker/DatePicker';
import DropdownList from '../DropdownList/DropdownList';
import style from './NewsPostForm.module.scss';
import { capitalize } from '@/utils/strings';
import EventCard from './EventCard';
import {
  createEventId,
  draftToEvent,
  emptyEvent,
  getDraftKey,
  getEventKey,
  loadDraft,
  makeDraft,
  parseDraftDate
} from './eventDraft';
import type { PostEvent } from './eventDraft';
import { useNewsPostDraft } from './useNewsPostDraft';

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
  connectedEvents?: PostEvent[];
  maxFileSizeBytes?: number;
  maxUploadSizeBytes?: number;
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

  const draftKey = getDraftKey(newsPost.id);
  const [initialScheduledFor] = useState(
    () => newsPost.scheduledPublish ?? new Date()
  );
  const [serverDraftJson] = useState(() =>
    JSON.stringify(
      makeDraft({
        titleEn: newsPost.titleEn ?? '',
        titleSv: newsPost.titleSv ?? '',
        contentEn: newsPost.contentEn ?? '',
        contentSv: newsPost.contentSv ?? '',
        group: newsPost.group ?? '',
        publish: newsPost.scheduledPublish ? 'schedule' : 'now',
        scheduledFor: initialScheduledFor,
        events: newsPost.connectedEvents ?? [],
        removeQueue: [],
        postId: newsPost.id
      })
    )
  );
  const [storedDraft] = useState(() => loadDraft(draftKey));
  const [submitted, setSubmitted] = useState(false);

  const [activeLanguage, setActiveLanguage] = useState<'en' | 'sv'>(
    newsPost.locale === 'en' ? 'en' : 'sv'
  );

  const [group, setGroup] = useState(newsPost.group ?? storedDraft?.group ?? '');
  const [titleEn, setTitleEn] = useState(
    storedDraft?.titleEn ?? newsPost.titleEn ?? ''
  );
  const [titleSv, setTitleSv] = useState(
    storedDraft?.titleSv ?? newsPost.titleSv ?? ''
  );
  const [contentEn, setContentEn] = useState(
    storedDraft?.contentEn ?? newsPost.contentEn ?? ''
  );
  const [contentSv, setContentSv] = useState(
    storedDraft?.contentSv ?? newsPost.contentSv ?? ''
  );
  const [publish, setPublish] = useState(
    newsPost.scheduledPublish === null
      ? 'now'
      : storedDraft?.publish === 'schedule' || storedDraft?.publish === 'now'
        ? storedDraft.publish
        : newsPost.scheduledPublish
          ? 'schedule'
          : 'now'
  );
  const [scheduledFor, setScheduledFor] = useState(
    parseDraftDate(storedDraft?.scheduledFor, initialScheduledFor)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<number | undefined>(
    newsPost.id ?? storedDraft?.postId
  );

  const [events, setEvents] = useState<PostEvent[]>(() => {
    const source = storedDraft?.events
      ? storedDraft.events
          .map(draftToEvent)
          .filter((event): event is PostEvent => event !== null)
      : (newsPost.connectedEvents ?? []);

    return source.map((event) => ({
      ...event,
      draftId:
        event.draftId ?? (event.id === undefined ? createEventId() : undefined)
    }));
  });
  const [removeQueue, setRemoveQueue] = useState<number[]>(
    storedDraft?.removeQueue ?? []
  );

  const currentDraft = makeDraft({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    group,
    publish,
    scheduledFor,
    events,
    removeQueue,
    postId: createdPostId
  });
  const { draftRestored, clearDraft, discardDraft } = useNewsPostDraft({
    draftKey,
    initialDraft: storedDraft,
    serverDraftJson,
    currentDraft,
    enabled: !submitted
  });

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const queuedFiles = Object.values(uploadQueue);
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
      toast.error(
        newsPost.id !== undefined ? l.editor.saveError : l.editor.postError
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateEvent<K extends keyof PostEvent>(
    eventKey: string,
    field: K,
    value: PostEvent[K]
  ) {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        getEventKey(event) === eventKey
          ? { ...event, [field]: value }
          : event
      )
    );
  }

  function handleEventDateChange(
    eventKey: string,
    field: 'startTime' | 'endTime',
    value: Date
  ) {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (getEventKey(event) !== eventKey) return event;

        const startTime = field === 'startTime' ? value : event.startTime;
        const endTime =
          field === 'endTime'
            ? value < startTime
              ? startTime
              : value
            : event.endTime < startTime
              ? startTime
              : event.endTime;

        return { ...event, startTime, endTime };
      })
    );
  }

  function removeEvent(eventKey: string) {
    const removed = events.find((event) => getEventKey(event) === eventKey);
    if (removed === undefined) return;

    setEvents((prevEvents) =>
      prevEvents.filter((event) => getEventKey(event) !== eventKey)
    );
    const removedId = removed.id;
    if (removedId !== undefined) {
      setRemoveQueue((prevQueue) =>
        prevQueue.includes(removedId)
          ? prevQueue
          : [...prevQueue, removedId]
      );
    }
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

  const isEditing =
    newsPost.id !== undefined || createdPostId !== undefined;

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
    document.getElementById(`content-tab-${nextLanguage}`)?.focus();
  };

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
        <div
          className={style.contentTabs}
          role="tablist"
          aria-label={l.editor.content}
        >
          {languageOrder.map((language) => {
            const complete = isLanguageComplete(language);
            const label = languageLabel(language);
            const status = complete
              ? l.editor.languageComplete
              : l.editor.languageIncomplete;

            return (
              <button
                key={language}
                id={`content-tab-${language}`}
                type="button"
                role="tab"
                aria-selected={activeLanguage === language}
                aria-controls={`content-panel-${language}`}
                tabIndex={activeLanguage === language ? 0 : -1}
                className={`${style.contentTab} ${
                  activeLanguage === language ? style.contentTabActive : ''
                }`}
                aria-label={`${label} ${status}`}
                title={`${label} ${status}`}
                onClick={() => setActiveLanguage(language)}
                onKeyDown={selectAdjacentLanguage}
              >
                {label}
                <span
                  className={`${style.languageStatus} ${
                    complete ? '' : style.languageIncomplete
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
            id={`content-panel-${language}`}
            role="tabpanel"
            aria-labelledby={`content-tab-${language}`}
            hidden={activeLanguage !== language}
            className={style.contentPanel}
          >
            <MarkdownEditor
              value={language === 'en' ? contentEn : contentSv}
              onUpload={dropFiles}
              onChange={language === 'en' ? setContentEn : setContentSv}
              locale={newsPost.locale}
              localFiles={uploadQueue}
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
        <div className={style.eventHeader}>
          <h2>{l.events.events}</h2>
          <ActionButton
            type="button"
            aria-label={l.events.add}
            title={l.events.add}
            onClick={() => {
              setEvents([
                ...events,
                { ...emptyEvent, draftId: createEventId() }
              ]);
            }}
          >
            <BsPlusLg />
          </ActionButton>
        </div>

        {events.length === 0 ? (
          <p>{l.events.empty}</p>
        ) : (
          <ul className={style.eventList}>
            {events.map((event) => {
              const eventKey = getEventKey(event);
              return (
                <li key={eventKey} className={style.eventCardItem}>
                  <EventCard
                    event={event}
                    locale={newsPost.locale}
                    languageLabel={languageLabel}
                    onChange={(field, value) =>
                      updateEvent(eventKey, field, value)
                    }
                    onDateChange={(field, value) =>
                      handleEventDateChange(eventKey, field, value)
                    }
                    onRemove={() => removeEvent(eventKey)}
                  />
                </li>
              );
            })}
          </ul>
        )}

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
