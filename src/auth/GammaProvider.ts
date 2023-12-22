import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth';
import { GammaUser } from '@/models/GammaModels';

export interface GammaProviderConfig extends OAuthUserConfig<GammaUser> {
  clientId: string;
  clientSecret: string;
  authorizationURL: string;
  tokenURL: string;
  profileUrl: string;
}


export default function GammaProvider(gammaConfig: GammaProviderConfig): OAuthConfig<GammaUser> {
  return {
    id: 'gamma',
    name: 'Gamma',
    type: 'oauth',
    authorization: {
      url: gammaConfig.authorizationURL,
      params: {
        scope: ''
      }
    },
    token: gammaConfig.tokenURL,
    userinfo: {
      url: gammaConfig.profileUrl,
      async request(context) {
        const response = await fetch(gammaConfig.profileUrl,
          {
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`
            }
          });

        if (!response.ok) {
          throw new Error('Failed to fetch user data!');
        }

        return await response.json() as GammaUser;
      }

    },
    profile(profile: GammaUser) {
      return {
        id: profile.cid,
        name: profile.nick,
        email: profile.email,
        image: profile.avatarUrl
      };
    },
    options: gammaConfig
  };
}