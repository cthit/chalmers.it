import { GammaUser, GammaSuperGroup } from '@/models/GammaModels';

const apiKey = process.env.GAMMA_API_KEY;
const gammaUrl = process.env.GAMMA_ROOT_URL?.replace(/\/$/, '');


export default class GammaService {
  static async getUser(cid: string) {
    return gammaGetRequest<GammaUser>(`/users/${cid}`);
  }

  static async getAllSuperGroups() {
    return gammaGetRequest<GammaSuperGroup[]>('/superGroups');
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