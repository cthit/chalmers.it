'use server';

import NavService from '@/services/navService';
import SessionService from '@/services/sessionService';

export async function addCategory(
  nameEn: string,
  nameSv: string,
  priority?: number,
  url?: string
) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  return await NavService.addCategory(nameEn, nameSv, priority, url);
}

export async function updateCategory(
  id: number,
  nameEn: string,
  nameSv: string,
  priority?: number,
  url?: string
) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  return await NavService.updateCategory(id, nameEn, nameSv, priority, url);
}

export async function removeCategory(id: number) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  return await NavService.removeCategory(id);
}

export async function addItem(
  categoryId: number,
  nameEn: string,
  nameSv: string,
  url: string,
  priority?: number
) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  return await NavService.addItem(categoryId, nameEn, nameSv, url, priority);
}

export async function updateItem(
  id: number,
  nameEn: string,
  nameSv: string,
  url: string,
  priority?: number
) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  return await NavService.updateItem(id, nameEn, nameSv, url, priority);
}

export async function removeItem(id: number) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  return await NavService.removeItem(id);
}
