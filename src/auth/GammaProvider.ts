import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth';
import { GammaProfile } from '@/models/GammaModels';

export interface GammaProviderConfig extends OAuthUserConfig<GammaProfile> {
  url: string;
  profileEndpoint: string;
  clientId: string;
  clientSecret: string;
}

export default function GammaProvider(
  gammaConfig: GammaProviderConfig
): OAuthConfig<GammaProfile> {
  return {
    id: 'gamma',
    name: 'Gamma',
    type: 'oauth',
    wellKnown: gammaConfig.url + '/.well-known/openid-configuration',
    authorization: { params: { scope: 'openid profile' } },
    userinfo: {
      async request(context) {
        const response = await fetch(
          gammaConfig.url + gammaConfig.profileEndpoint,
          {
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user data!');
        }

        return (await response.json()) as GammaProfile;
      }
    },
    profile(profile: GammaProfile) {
      console.log('Received profile', profile);
      return {
        id: profile.sub,
        name: profile.nickname,
        email: profile.email,
        image: profile.picture
      };
    },
    options: gammaConfig
  };
}
