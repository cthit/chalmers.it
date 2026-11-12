import styles from './ActionButton.module.scss';
import { ButtonHTMLAttributes } from 'react';
import React from 'react';

export type ActionButtonVariant = 'primary' | 'secondary';
export type ActionButtonProps = {
  variant?: ActionButtonVariant;
};

const ActionButton = ({
  className,
  children,
  variant = 'primary',
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & ActionButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ActionButton;
