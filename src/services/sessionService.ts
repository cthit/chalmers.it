import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import DivisionGroupService from './divisionGroupService';
import { Session } from 'next-auth';
import prisma from '@/prisma';

/**
 * Service for handling the session of the current user
 */
export default class SessionService {
  private static async getSession() {
    return await getServerSession(authConfig);
  }

  static async getUser(s?: Session | null) {
    const session = s ?? (await SessionService.getSession());
    return session?.user;
  }

  static async getActiveGroups(s?: Session | null) {
    const session = s ?? (await SessionService.getSession());
    return session?.user?.id
      ? await DivisionGroupService.getUserActiveGroups(session?.user?.id!)
      : [];
  }

  static async getActiveAddedGroups(s?: Session | null) {
    const session = s ?? (await SessionService.getSession());
    const activeGroups = await this.getActiveGroups(session);
    const addedGroups = await DivisionGroupService.getAll();
    return activeGroups.filter((a) =>
      addedGroups.some((g) => a.superGroup!.id === g.gammaSuperGroupId)
    );
  }

  static async canEditGroup(gammaSuperGroupId: string, s?: Session | null) {
    const session = s ?? (await SessionService.getSession());

    const activeGroups = session?.user?.id
      ? await DivisionGroupService.getUserActiveGroups(session?.user?.id!)
      : [];
    return activeGroups.some((g) => g.superGroup!.id === gammaSuperGroupId);
  }

  static async canEditGroupByInternalId(id: number, s?: Session | null) {
    const session = s ?? (await SessionService.getSession());

    const gammaSuperGroupId =
      await DivisionGroupService.getGammaSuperGroupIdFromInternalId(id);

    const activeGroups = session?.user?.id
      ? await DivisionGroupService.getUserActiveGroups(session?.user?.id!)
      : [];
    return activeGroups.some((g) => g?.id === gammaSuperGroupId);
  }

  static async isActive(s?: Session | null) {
    const session = s ?? (await SessionService.getSession());
    return session?.user?.id
      ? await DivisionGroupService.isUserActive(session?.user?.id!)
      : false;
  }

  static async isAdmin(s?: Session | null) {
    const session = s ?? (await SessionService.getSession());

    const adminGroups = (process.env.ADMIN_GROUPS || 'styrit').split(',');
    const groups = SessionService.getActiveGroups();

    return session?.user?.id
      ? (await groups).some((g) => adminGroups.includes(g.superGroup!.name))
      : false;
  }

  static async isCorporateRelations(s?: Session | null) {
    const session = s ?? (await SessionService.getSession());
    if (await this.isAdmin(session)) return true;

    const corporateRelationsGroup =
      process.env.CORPORATE_RELATIONS_GROUP || 'armit';
    const groups = SessionService.getActiveGroups();

    return session?.user?.id
      ? (await groups).some(
          (g) => g.superGroup!.name === corporateRelationsGroup
        )
      : false;
  }

  static async isNewsPostOwner(postId: number, s?: Session | null) {
    const post = await prisma.newsPost.findUnique({
      where: {
        id: postId
      },
      select: {
        writtenByGammaUserId: true,
        writtenFor: {
          select: {
            gammaSuperGroupId: true
          }
        }
      }
    });

    if (!post) return false;

    const session = s ?? (await getServerSession(authConfig));

    return (
      session?.user?.id === post.writtenByGammaUserId ||
      (post.writtenFor?.gammaSuperGroupId
        ? await SessionService.canEditGroup(
            post.writtenFor!.gammaSuperGroupId,
            session
          )
        : false)
    );
  }
}
