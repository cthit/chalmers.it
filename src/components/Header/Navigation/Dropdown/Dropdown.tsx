'use client';

import styles from './Dropdown.module.scss';
import { HTMLAttributes, ReactNode, useRef, useState } from 'react';
import useClickOutside from '@/hooks/clickOutside';

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
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsDroppedDown(false));

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
      <label
        htmlFor={id}
        className={styles.dropdownLabel}
        onClick={() => setIsDroppedDown((d) => !d)}
      >
        {parent}
      </label>
      <div className={`${styles.dropdownHitbox}`} />

      <div className={`${styles.dropdownContainer} ${contentClassName}`}>
        <div className={styles.dropdownContent}>{children}</div>
      </div>
    </div>
  );
};

export default Dropdown;
