'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import i18nService from '@/services/i18nService';
import { signIn } from 'next-auth/react';

const LoginButton = ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  return (
    <ActionButton onClick={() => signIn('gamma')}>{l.user.login}</ActionButton>
  );
};

export default LoginButton;
