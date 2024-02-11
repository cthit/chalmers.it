'use server';
import NotifyService from "@/services/notifyService";
import { Language, NotifierType } from "@prisma/client";

export async function addNotifier(type: NotifierType, language: Language, webhook: string) {
  NotifyService.addNotifier(type, language, webhook);
}
