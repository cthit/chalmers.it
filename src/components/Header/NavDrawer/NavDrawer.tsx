'use client';

import styles from './NavDrawer.module.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NavDrawer = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <a className={styles.toggle} onClick={() => setOpen(!open)}>
        <FontAwesomeIcon icon={faBars} />
      </a>
      <div className={`${styles.drawer} ${open ? styles.open : styles.closed}`}>
        <div className={styles.content}>{children}</div>
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      </div>
    </div>
  );
};

export default NavDrawer;
