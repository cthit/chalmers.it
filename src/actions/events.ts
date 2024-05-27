'use server';

import EventService from '@/services/eventService';

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
  EventService.update(id, data);
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
  EventService.create(data);
}

export async function deleteEvent(id: number) {
  EventService.delete(id);
}
