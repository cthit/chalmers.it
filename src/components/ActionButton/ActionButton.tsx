import styles from './ActionButton.module.scss';
import { ButtonHTMLAttributes } from 'react';
import React from 'react';

export type ActionButtonVariant = 'primary' | 'secondary';
export type ActionButtonProps = {
  variant?: ActionButtonVariant;
  iconOnly?: boolean;
};

const ActionButton = ({
  className,
  children,
  variant = 'primary',
  iconOnly = false,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & ActionButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        iconOnly ? styles.icon : ''
      } ${className}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ActionButton;
