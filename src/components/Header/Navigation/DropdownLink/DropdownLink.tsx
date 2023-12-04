import { Playfair_Display } from 'next/font/google';
import styles from './DropdownLink.module.scss';
import { ReactNode } from 'react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '500' });

type Props = {
  children: ReactNode;
  text: string;
};

const DropdownLink = ({ text, children }: Props) => {
  return (
    <div className={styles.dropdown}>
      <div className={styles.navLink}>
        <p className={playfair.className}>{text} </p>
        <p className={styles.navLinkArrow}>&nbsp;&#9660; </p>
      </div>

      <div className={`${styles.dropdownContent}  ${playfair.className}`}>
        {children}
      </div>
    </div>
  );
};

export default DropdownLink;
