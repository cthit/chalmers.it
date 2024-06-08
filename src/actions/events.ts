'use server';

import EventService from '@/services/eventService';
import SessionService from '@/services/sessionService';

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
