import styles from './Collapsible.module.scss';
import { MdOutlineExpandMore, MdOutlineExpandLess } from 'react-icons/md';

const Collapsible = ({
  children,
  id
}: {
  children: React.ReactNode;
  id: string;
}) => {
  return (
    <div className={styles.collapsible}>
      <input type="checkbox" id={id} hidden />
      <div className={styles.content}>{children}</div>
      <label htmlFor={id} className={styles.button}>
        <MdOutlineExpandLess className={styles.close} />
        <MdOutlineExpandMore className={styles.open} />
      </label>
    </div>
  );
};

export default Collapsible;
