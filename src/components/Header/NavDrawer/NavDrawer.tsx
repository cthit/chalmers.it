'use client';

import styles from './NavDrawer.module.scss';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa6';

const NavDrawer = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <FaBars className={styles.toggle} onClick={() => setOpen(!open)} />
      <div className={`${styles.drawer} ${open ? styles.open : styles.closed}`}>
        <div className={styles.content}>{children}</div>
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      </div>
    </div>
  );
};

export default NavDrawer;
