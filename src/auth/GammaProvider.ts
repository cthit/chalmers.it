import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth';
import { GammaProfile } from '@/types/gamma';

export default function GammaProvider(
  config: OAuthUserConfig<GammaProfile>
): OAuthConfig<GammaProfile> {
  return {
    id: 'gamma',
    name: 'Gamma',
    type: 'oauth',
    idToken: true,
    authorization: { params: { scope: 'openid profile' } },
    profile: (p: GammaProfile) => ({
      id: p.sub,
      name: p.nickname,
      email: p.email,
      image: p.picture
    }),
    options: config
  };
}
