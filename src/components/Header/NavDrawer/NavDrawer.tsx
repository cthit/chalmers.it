import styles from './NavDrawer.module.scss';
import { FaBars } from 'react-icons/fa6';

const NavDrawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <label htmlFor="drawer-toggle">
        <FaBars className={styles.toggle} />
      </label>
      <input
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
