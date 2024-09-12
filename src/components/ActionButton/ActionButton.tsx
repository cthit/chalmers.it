import styles from './ActionButton.module.scss';
import { Poppins } from 'next/font/google';
import { ButtonHTMLAttributes } from 'react';
import React from 'react';

const poppins = Poppins({ weight: ['500'], subsets: ['latin'] });

const ActionButton = ({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`${styles.button} ${poppins.className} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ActionButton;
