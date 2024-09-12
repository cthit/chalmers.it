'use client';

import styles from './ContentPaneCollapsible.module.scss';
import { MdOutlineExpandMore, MdOutlineExpandLess } from 'react-icons/md';
import { HTMLAttributes, useState } from 'react';

const ContentPaneCollapsible = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      {...rest}
      className={`${styles.collapsible} ${open ? '' : styles.fade} ${className}`}
    >
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

export default ContentPaneCollapsible;
