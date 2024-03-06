import { GammaSuperGroupBlob, GammaUserInfo } from '@/types/gamma';

const apiKey =
  process.env.GAMMA_API_KEY_ID + ':' + process.env.GAMMA_API_KEY_TOKEN;
const gammaUrl = process.env.GAMMA_ROOT_URL?.replace(/\/$/, '');

export default class GammaService {
  static async getUser(uuid: string) {
    return await gammaGetRequest<GammaUserInfo>(`/info/v1/users/${uuid}`);
  }

  static getUserAvatar(uuid: string) {
    return `${gammaUrl}/images/user/avatar/${uuid}`;
  }

  static getGroupAvatar(gid: string) {
    return `${gammaUrl}/images/group/avatar/${gid}`;
  }

  static async getAllSuperGroups() {
    return await gammaGetRequest<GammaSuperGroupBlob>('/info/v1/blob');
  }

  static async getAllActiveSuperGroups() {
    return (
      (await this.getAllSuperGroups())
        .filter((sg) => sg.type === 'committee')
        .flatMap((sg) => sg.superGroups) || []
    );
  }

  static async getSuperGroupMembers(sgid: string) {
    let activeGroups = await this.getAllActiveSuperGroups();
    return (
      activeGroups.find((group) => group.superGroup.id === sgid)?.members || []
    );
  }
}

const gammaGetRequest = async <T>(path: string): Promise<T> => {
  const response = await fetch(gammaUrl + '/api' + path, {
    headers: {
      Authorization: 'pre-shared ' + apiKey
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => response.statusText);
    throw new Error(`Gamma request failed with status ${response.status}`, {
      cause: errorData
    });
  }

  return await response.json();
};
