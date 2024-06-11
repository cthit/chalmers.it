'use client';

import { Playfair_Display } from 'next/font/google';
import styles from './Dropdown.module.scss';
import { HTMLAttributes, ReactNode } from 'react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '800' });

type Props = {
  parent: ReactNode;
  id: string;
  children: ReactNode;
  contentClassName?: string;
};

const Dropdown = ({
  children,
  parent,
  id,
  className,
  contentClassName,
  ...rest
}: Props & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`${styles.dropdown} ${className}`} {...rest}>
      <input
        type="radio"
        id={id}
        name="dropdown"
        className={styles.dropdownInput}
        hidden
      />
      <label htmlFor={id} className={styles.dropdownLabel}>
        {parent}
      </label>
      <div className={styles.dropdownHitbox} />

      <div
        className={`${styles.dropdownContent} ${playfair.className} ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
