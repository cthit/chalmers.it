'use client';
import { useRef, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './NavDrawer.module.scss';
import { FaBars } from 'react-icons/fa6';

const NavDrawer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (inputRef.current) {
      inputRef.current.checked = false;
    }
  };

  useEffect(() => {
    handleClose();
  }, [pathname, searchParams]);

  return (
    <div>
      <label htmlFor="drawer-toggle">
        <FaBars className={styles.toggle} />
      </label>
      <input
        ref={inputRef}
        className={styles.checkbox}
        type="checkbox"
        id="drawer-toggle"
        hidden
      />
      <div className={styles.drawer}>
        <div className={styles.content}>{children}</div>
        <label htmlFor="drawer-toggle" className={styles.overlay} />
      </div>
    </div>
  );
};

export default NavDrawer;
