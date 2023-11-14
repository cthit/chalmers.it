import { Playfair_Display, Poppins } from 'next/font/google';
import styles from './DropdownLink.module.scss';
import Link from 'next/link';
import { ReactNode } from 'react';

const playfair = Playfair_Display({ subsets: ['latin'] });

type Props = {
  children: ReactNode;
  text: string;
};

const DropdownLink = ({ text, children }: Props) => {
  return (
    <div className={styles.dropdown}>
      <div className={styles.navLink}>
        <p className={playfair.className}>{text}</p>
        <img className={styles.dropdownIcon} src="/dropdown.svg" />
      </div>

      <div className={`${styles.dropdownContent}  ${playfair.className}`}>
        {children}
      </div>
    </div>
  );
};

export default DropdownLink;
