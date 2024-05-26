'use server';

import EventService from '@/services/eventService';

export async function editEvent(
  gammaSuperGroupId: number,
  prettyName: {
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
  EventService.update(gammaSuperGroupId, prettyName);
}

export async function createEvent(prettyName: {
  titleEn: string;
  titleSv: string;
  descriptionEn: string;
  descriptionSv: string;
  fullDay: boolean;
  startTime: Date;
  endTime: Date;
  newsPostId?: number | undefined;
}) {
  EventService.create(prettyName);
}
