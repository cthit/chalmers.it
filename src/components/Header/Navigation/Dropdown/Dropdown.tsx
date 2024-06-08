'use client';

import { Playfair_Display } from 'next/font/google';
import styles from './Dropdown.module.scss';
import { HTMLAttributes, ReactNode } from 'react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '800' });

type Props = {
  parent: ReactNode;
  id: string;
  children: ReactNode;
};

const Dropdown = ({
  children,
  parent,
  id,
  className,
  ...rest
}: Props & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`${styles.dropdown} ${className}`} {...rest}>
      <input
        type="radio"
        id={id}
        name="dropdown"
        className={styles.dropdownInput}
      />
      <label htmlFor={id} className={styles.dropdownLabel}>
        {parent}
      </label>
      <div className={`${styles.dropdownContent} ${playfair.className}`}>
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
