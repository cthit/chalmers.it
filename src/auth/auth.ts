import type { NextAuthOptions } from 'next-auth';
import GammaProvider from '@/auth/GammaProvider';

export const authConfig: NextAuthOptions = {
  providers: [
    GammaProvider({
      authorizationURL: 'http://localhost:8081/api/oauth/authorize',
      clientId: 'id',
      clientSecret: 'secret',
      profileUrl: 'http://localhost:8081/api/users/me',
      tokenURL: 'http://localhost:8081/api/oauth/token'
    })
  ]
};
