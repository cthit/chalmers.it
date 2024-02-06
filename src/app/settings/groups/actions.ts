'use server';

import DivisionGroupService from '@/services/divisionGroupService';

export async function addGroup(gammaSuperGroupId: string, prettyName: string) {
  DivisionGroupService.addGroup(gammaSuperGroupId, prettyName);
}
