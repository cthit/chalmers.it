import styles from './ActionButton.module.scss';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import React from 'react';
import { ActionButtonProps } from './ActionButton';

const ActionLink = ({
  className,
  children,
  variant = "primary",
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & ActionButtonProps) => {
  return (
    <Link className={`${styles.button} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
};

export default ActionLink;
