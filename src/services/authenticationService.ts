import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import DivisionGroupService from './divisionGroupService';

export default class AuthenticationService {
  private static async getSession() {
    return await getServerSession(authConfig);
  }

  static async canPostNews() {
    const session = await this.getSession();
    return session?.user?.id
      ? DivisionGroupService.isUserActive(session?.user?.id!)
      : false;
  }
}
