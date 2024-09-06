'use server';

import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import SessionService from '@/services/sessionService';

export async function addGroup(gammaSuperGroupId: string) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  const group = (await GammaService.getAllSuperGroups()).find(
    (g) => g.superGroup.id === gammaSuperGroupId
  )?.superGroup;

  const prettyName = group?.prettyName || group?.name || 'Unnamed Group';
  const slug = group?.name.toLowerCase() || 'unnamed-group';
  await DivisionGroupService.addGroup(gammaSuperGroupId, prettyName, slug);
}

export async function removeGroup(gammaSuperGroupId: string) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  await DivisionGroupService.removeGroup(gammaSuperGroupId);
}

export async function editGroup(gammaSuperGroupId: string, priority: number) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  await DivisionGroupService.editPriority(gammaSuperGroupId, priority);
}
