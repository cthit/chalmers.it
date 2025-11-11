import styles from './ActionButton.module.scss';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import React from 'react';

const ActionLink = ({
  className,
  children,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link className={`${styles.button} ${className}`} {...rest}>
      {children}
    </Link>
  );
};

export default ActionLink;
