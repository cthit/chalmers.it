import styles from './ActionButton.module.scss';
import { ButtonHTMLAttributes } from 'react';
import React from 'react';

const ActionButton = ({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={`${styles.button} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default ActionButton;
