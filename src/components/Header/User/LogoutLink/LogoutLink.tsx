'use client';

import { signOut } from 'next-auth/react';

const LogoutLink = () => (
  <a style={{ cursor: 'pointer' }} onClick={() => signOut()}>
    Logga ut
  </a>
);

export default LogoutLink;
