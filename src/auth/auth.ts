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
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.cid = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.cid as string | null;
      }
      return session;
    }
  }
};
