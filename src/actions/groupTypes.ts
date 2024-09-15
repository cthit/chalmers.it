'use server';

import DivisionGroupService from '@/services/divisionGroupService';
import SessionService from '@/services/sessionService';

export const createType = async (
  nameEn: string,
  nameSv: string,
  priority?: number
) => {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  await DivisionGroupService.createType(nameEn, nameSv, priority);
};

export const editType = async (
  id: number,
  nameEn: string,
  nameSv: string,
  priority: number
) => {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  await DivisionGroupService.editType(id, nameEn, nameSv, priority);
};

export const deleteType = async (id: number) => {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  await DivisionGroupService.deleteType(id);
};
