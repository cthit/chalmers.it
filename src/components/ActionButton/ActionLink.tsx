import styles from './ActionButton.module.scss';
import { Inter } from 'next/font/google';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

const ActionLink = ({
  className,
  children,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link
      className={`${styles.button} ${inter.className} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default ActionLink;
