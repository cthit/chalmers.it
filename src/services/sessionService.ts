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

  static async getActiveGroups() {
    const session = await this.getSession();
    return session?.user?.id
      ? await DivisionGroupService.getUserActiveGroups(session?.user?.id!)
      : [];
  }

  static async canPostNews() {
    const session = await this.getSession();
    return session?.user?.id
      ? await DivisionGroupService.isUserActive(session?.user?.id!)
      : false;
  }
}
