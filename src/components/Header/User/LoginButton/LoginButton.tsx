'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import { signIn } from 'next-auth/react';

const LoginButton = () => (
  <ActionButton onClick={() => signIn('gamma')}>Logga in</ActionButton>
);

export default LoginButton;
