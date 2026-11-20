import type { EventLanguage } from '@prisma/client';

export const LOCAL_DRAFT_KEY_PREFIX = 'newsPostDraft';

export interface PostEvent {
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
}

export interface DraftEvent extends Omit<PostEvent, 'startTime' | 'endTime'> {
  startTime: string;
  endTime: string;
}

export interface NewsPostDraft {
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

export const emptyEvent: PostEvent = {
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
  draftId: undefined
};

export function getDraftKey(postId?: number) {
  return postId !== undefined
    ? `${LOCAL_DRAFT_KEY_PREFIX}:edit:${postId}`
    : `${LOCAL_DRAFT_KEY_PREFIX}:new`;
}

export function createEventId() {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getEventKey(event: PostEvent) {
  return event.draftId ?? `event-${event.id}`;
}

export function eventToDraft(event: PostEvent): DraftEvent {
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

export function draftToEvent(event: DraftEvent): PostEvent | null {
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

export function parseDraftDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

interface MakeDraftInput {
  titleEn: string;
  titleSv: string;
  contentEn: string;
  contentSv: string;
  group: string;
  publish: string;
  scheduledFor: Date;
  events: PostEvent[];
  removeQueue: number[];
  postId?: number;
}

export function makeDraft({
  titleEn,
  titleSv,
  contentEn,
  contentSv,
  group,
  publish,
  scheduledFor,
  events,
  removeQueue,
  postId
}: MakeDraftInput): NewsPostDraft {
  return {
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    group,
    publish,
    scheduledFor: Number.isNaN(scheduledFor.getTime())
      ? ''
      : scheduledFor.toISOString(),
    events: events.map(eventToDraft),
    removeQueue,
    postId
  };
}

export function loadDraft(draftKey: string): NewsPostDraft | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const loaded = localStorage.getItem(draftKey);
    return loaded ? JSON.parse(loaded) : null;
  } catch {
    return null;
  }
}
