import {
  GammaGroup,
  GammaGroupMember,
  GammaSuperGroup,
  GammaUser
} from '@/models/GammaModels';

const apiKey = process.env.GAMMA_API_KEY;
const gammaUrl = process.env.GAMMA_ROOT_URL?.replace(/\/$/, '');

export default class GammaService {
  static async getUser(cid: string) {
    return gammaGetRequest<GammaUser>(`/users/${cid}`);
  }

  static async getAllSuperGroups() {
    return gammaGetRequest<GammaSuperGroup[]>('/superGroups');
  }

  static async getSuperGroupMembers(sgid: string) {
    let activeGroups = await this.getSuperGroupSubGroups(sgid);
    let membersWithDuplicates = (
      await Promise.all(
        activeGroups.map(async (group) => {
          return await this.getGroupMembers(group.id);
        })
      )
    ).flat();

    return membersWithDuplicates.filter((member, index, self) => {
      return index === self.findIndex((t) => t.cid === member.cid);
    });
  }

  static async getGroupMembers(gid: string) {
    interface GroupMembersResponse {
      members: GammaGroupMember[];
    }

    return (
      await gammaGetRequest<GroupMembersResponse>(`/groups/${gid}/members`)
    ).members;
  }

  static async getSuperGroupSubGroups(sgid: string) {
    return gammaGetRequest<GammaGroup[]>(`/superGroups/${sgid}/subgroups`);
  }
}

const gammaGetRequest = async <T>(path: string): Promise<T> => {
  const response = await fetch(gammaUrl + '/api' + path, {
    headers: {
      Authorization: 'pre-shared ' + apiKey
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gamma request failed with status ${response.status}`, {
      cause: errorData
    });
  }

  return await response.json();
};
