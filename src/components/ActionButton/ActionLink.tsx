import styles from './ActionButton.module.scss';
import { Poppins } from 'next/font/google';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import React from 'react';

const poppins = Poppins({ weight:'600',subsets: ['latin'] });

const ActionLink = ({
  className,
  children,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link
      className={`${styles.button} ${poppins.className} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default ActionLink;
