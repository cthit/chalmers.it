import type { NextAuthOptions } from 'next-auth';
import GammaProvider from '@/auth/GammaProvider';

const gammaUrl = process.env.GAMMA_ROOT_URL?.replace(/\/$/, '');

export const authConfig: NextAuthOptions = {
  providers: [
    GammaProvider({
      authorizationURL: gammaUrl + '/api/oauth/authorize',
      clientId: 'id',
      clientSecret: 'secret',
      profileUrl: gammaUrl + '/api/users/me',
      tokenURL: gammaUrl + '/api/oauth/token'
    })
  ]
};
