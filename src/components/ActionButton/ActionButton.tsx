import styles from './ActionButton.module.scss';
import { Playfair_Display } from 'next/font/google';
import { ButtonHTMLAttributes } from 'react';
import React from 'react';

const playfair = Playfair_Display({ subsets: ['latin'] });

const ActionButton = ({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`${styles.button} ${playfair.className} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ActionButton;
