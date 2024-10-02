'use client';

import styles from './Collapsible.module.scss';
import { MdOutlineExpandMore, MdOutlineExpandLess } from 'react-icons/md';
import { useState } from 'react';

const Collapsible = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.collapsible}>
      <div
        className={`${styles.content} ${open ? styles.open : styles.closed}`}
      >
        {children}
      </div>
      <button className={styles.button} onClick={() => setOpen(!open)}>
        {open ? <MdOutlineExpandLess /> : <MdOutlineExpandMore />}
      </button>
    </div>
  );
};

export default Collapsible;
