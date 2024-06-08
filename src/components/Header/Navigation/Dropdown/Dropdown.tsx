'use client';

import { Playfair_Display } from 'next/font/google';
import styles from './Dropdown.module.scss';
import { ReactNode } from 'react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '800' });

type Props = {
  parent: ReactNode;
  id: string;
  children: ReactNode;
};

const Dropdown = ({ children, parent, id }: Props) => {
  return (
    <div>
      <input type="radio" id={id} name="dropdown" className={styles.dropdownInput} />
      <label htmlFor={id} className={styles.dropdown}>{parent}</label>
      <div className={`${styles.dropdownContent} ${playfair.className}`}>
        {children}
      </div>
    </div>
  );
};

export default Dropdown;