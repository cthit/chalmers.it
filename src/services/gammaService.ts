import { GammaSuperGroupBlob, GammaUserInfo, GammaGroup } from '@/types/gamma';

const apiKey =
  process.env.GAMMA_API_KEY_ID + ':' + process.env.GAMMA_API_KEY_TOKEN;
const activeGroupTypes = (
  process.env.ACTIVE_GROUP_TYPES || 'committee,society'
).split(',');

export default class GammaService {
  static gammaUrl = process.env.GAMMA_ROOT_URL?.replace(/\/$/, '');

  static async getUser(uuid: string) {
    return await gammaGetRequest<GammaUserInfo>(`/info/v1/users/${uuid}`);
  }

  static async getNick(uuid: string) {
    return (await this.getUser(uuid).catch(() => undefined))?.user.nick;
  }

  static getUserAvatarURL(uuid: string) {
    return `${this.gammaUrl}/images/user/avatar/${uuid}`;
  }

  static getGroupAvatarURL(gid: string) {
    return `${this.gammaUrl}/images/group/avatar/${gid}`;
  }

  static isSuperGroupActive(sg: { type: string }) {
    return activeGroupTypes.includes(sg.type);
  }

  static isGroupActive(g: GammaGroup) {
    return this.isSuperGroupActive(g.superGroup);
  }

  static async getAllSuperGroups() {
    return (
      (await gammaGetRequest<GammaSuperGroupBlob>('/info/v1/blob')).flatMap(
        (sg) => sg.superGroups
      ) || []
    );
  }

  static async getSuperGroupMembers(sgid: string) {
    // We assume all super groups are active from the info API
    const activeGroups = await this.getAllSuperGroups();
    return (
      activeGroups.find((group) => group.superGroup.id === sgid)?.members || []
    );
  }
}

const gammaGetRequest = async <T>(path: string): Promise<T> => {
  const response = await fetch(GammaService.gammaUrl + '/api' + path, {
    headers: {
      Authorization: 'pre-shared ' + apiKey
    },
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => response.statusText);
    throw new Error(`Gamma request failed with status ${response.status}`, {
      cause: errorData
    });
  }

  return await response.json();
};
