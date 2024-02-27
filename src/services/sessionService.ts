import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import DivisionGroupService from './divisionGroupService';

/**
 * Service for handling the session of the current user
 */
export default class SessionService {
  private static async getSession() {
    return await getServerSession(authConfig);
  }

  static async getUser() {
    const session = await SessionService.getSession();
    return session?.user;
  }

  static async getActiveGroups() {
    const session = await SessionService.getSession();
    return session?.user?.id
      ? await DivisionGroupService.getUserActiveGroups(session?.user?.id!)
      : [];
  }

  static async canEditGroup(gammaSuperGroupId: string) {
    const session = await SessionService.getSession();
    const activeGroups = session?.user?.id
      ? await DivisionGroupService.getUserActiveGroups(session?.user?.id!)
      : [];
    return activeGroups.some((g) => g.superGroup!.id === gammaSuperGroupId);
  }

  static async isActive() {
    const session = await SessionService.getSession();
    return session?.user?.id
      ? await DivisionGroupService.isUserActive(session?.user?.id!)
      : false;
  }

  static async isAdmin() {
    const session = await SessionService.getSession();

    const adminGroups = (process.env.ADMIN_GROUPS || 'styrit').split(',');
    const groups = SessionService.getActiveGroups();

    return session?.user?.id
      ? (await groups).some((g) => adminGroups.includes(g.superGroup!.name))
      : false;
  }

  static async isCorporateRelations() {
    const session = await SessionService.getSession();

    const corporateRelationsGroup =
      process.env.CORPORATE_RELATIONS_GROUP || 'armit';
    const groups = SessionService.getActiveGroups();

    return session?.user?.id
      ? (await groups).some(
          (g) => g.superGroup!.name === corporateRelationsGroup
        )
      : false;
  }
}
