'use server';

import DivisionGroupService from '@/services/divisionGroupService';

export async function removeGroup(gammaSuperGroupId: string) {
  DivisionGroupService.removeGroup(gammaSuperGroupId);
}
