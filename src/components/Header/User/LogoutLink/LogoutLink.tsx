'use client';

import i18nService from '@/services/i18nService';
import { signOut } from 'next-auth/react';

const LogoutLink = ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  return (
    <a style={{ cursor: 'pointer' }} onClick={() => signOut()}>
      {l.user.logout}
    </a>
  );
};

export default LogoutLink;
