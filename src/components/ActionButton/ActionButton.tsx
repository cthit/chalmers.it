import styles from './ActionButton.module.scss';
import { Inter } from 'next/font/google';
import { ButtonHTMLAttributes } from 'react';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

const ActionButton = ({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`${styles.button} ${inter.className} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ActionButton;
