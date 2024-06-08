import styles from './ActionButton.module.scss';
import { Playfair_Display } from 'next/font/google';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import React from 'react';

const playfair = Playfair_Display({ subsets: ['latin'] });

const ActionLink = ({
  className,
  children,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link
      className={`${styles.button} ${playfair.className} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default ActionLink;
