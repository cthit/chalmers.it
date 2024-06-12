'use server';

import EventService from '@/services/eventService';
import SessionService from '@/services/sessionService';

const stripTime = (d: Date) => {
  return d.setHours(0, 0, 0, 0);
};

async function throwIfUnauthorized() {
  if (!(await SessionService.isAdmin()) && !(await SessionService.isActive())) {
    throw new Error('Unauthorized');
  }
}

export async function editEvent(
  id: number,
  data: {
    titleEn: string;
    titleSv: string;
    descriptionEn: string;
    descriptionSv: string;
    fullDay: boolean;
    startTime: Date;
    endTime: Date;
    newsPostId?: number | undefined;
  }
) {
  await throwIfUnauthorized();

  await EventService.update(id, data);
}

export async function createEvent(data: {
  titleEn: string;
  titleSv: string;
  descriptionEn: string;
  descriptionSv: string;
  fullDay: boolean;
  startTime: Date;
  endTime: Date;
  newsPostId?: number | undefined;
}) {
  await throwIfUnauthorized();

  await EventService.create(data);
}

export async function deleteEvent(id: number) {
  await throwIfUnauthorized();

  await EventService.delete(id);
}

export async function getAllEvents() {
  const events = await EventService.getAll();
  const eventMap: {
    [key: number]: {
      id: number;
      titleSv: string;
      titleEn: string;
      descriptionEn: string;
      descriptionSv: string;
      fullDay: boolean;
      startTime: Date;
      endTime: Date;
      location: string | null;
      createdAt: Date;
      updatedAt: Date;
      newsPostId: number | null;
    }[];
  } = {};

  events.forEach((event) => {
    const date = stripTime(event.startTime);
    if (!eventMap[date]) {
      eventMap[date] = [];
    }
    eventMap[date].push(event);
  });

  return eventMap;
}
