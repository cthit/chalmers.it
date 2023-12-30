import { Playfair_Display } from 'next/font/google';
import styles from './DropdownLink.module.scss';
import { ReactNode } from 'react';
import Dropdown from '../Dropdown/Dropdown';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '800' });

type Props = {
  children: ReactNode;
  text: string;
};

const DropdownLink = ({ text, children }: Props) => {
  return (
    <Dropdown
      parent={
        <div className={styles.navLink}>
          <p className={playfair.className}>{text} </p>
          <p className={styles.navLinkArrow}>&nbsp;&#9660; </p>
        </div>
      }
    >
      {children}
    </Dropdown>
  );
};

export default DropdownLink;
