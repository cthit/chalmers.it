import NextAuth from 'next-auth'; // eslint-disable-line

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      name: string;
      email?: string | null;
      image?: string | null;
    };
    expires: ISODateString;
  }
}
