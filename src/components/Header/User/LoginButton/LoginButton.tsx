'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import i18nService from '@/services/i18nService';
import { signIn } from 'next-auth/react';

const LoginButton = ({
  locale,
  className
}: {
  locale: string;
  className?: string;
}) => {
  const l = i18nService.getLocale(locale);
  return (
    <ActionButton className={className} onClick={() => signIn('gamma')}>
      {l.user.login}
    </ActionButton>
  );
};

export default LoginButton;
