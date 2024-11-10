'use client';

import { Poppins } from 'next/font/google';
import styles from './Dropdown.module.scss';
import { HTMLAttributes, ReactNode, useState } from 'react';
import useComponentClicked from '@/hooks/componentClicked';

const poppins = Poppins({ subsets: ['latin'], weight: ['500'] });

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
  const [isDroppedDown, setIsDroppedDown] = useState(false);
  const ref = useComponentClicked((f) => setIsDroppedDown(f));

  return (
    <div ref={ref} className={`${styles.dropdown} ${className}`} {...rest}>
      <input
        type="checkbox"
        id={id}
        name="dropdown"
        className={styles.dropdownInput}
        checked={isDroppedDown}
        readOnly
        hidden
      />
      <label htmlFor={id} className={styles.dropdownLabel}>
        {parent}
      </label>
      <div className={`${styles.dropdownHitbox}`} />

      <div className={`${styles.dropdownContainer} ${contentClassName}`}>
        <div className={`${styles.dropdownContent} ${poppins.className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
