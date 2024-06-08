import type { NextAuthOptions } from 'next-auth';
import GammaProvider from '@/auth/GammaProvider';

const gammaUrl = process.env.GAMMA_ROOT_URL?.replace(/\/$/, '');

export const authConfig: NextAuthOptions = {
  providers: [
    GammaProvider({
      wellKnown: gammaUrl,
      clientId: process.env.GAMMA_CLIENT_ID ?? 'id',
      clientSecret: process.env.GAMMA_CLIENT_SECRET ?? 'secret'
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};
