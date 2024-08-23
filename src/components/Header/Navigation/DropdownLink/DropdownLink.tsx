import { Inter } from 'next/font/google';
import styles from './DropdownLink.module.scss';
import { HTMLAttributes } from 'react';
import Dropdown from '../Dropdown/Dropdown';

const inter = Inter({ subsets: ['latin'], weight: '600' });

type Props = {
  text: string;
  desktop?: boolean;
  contentClassName?: string;
};

const DropdownLink = ({
  text,
  desktop,
  children,
  ...rest
}: Props & HTMLAttributes<HTMLDivElement>) => {
  return (
    <Dropdown
      {...rest}
      parent={
        <div className={styles.navLink}>
          <p className={inter.className}>{text} </p>
          <p className={styles.navLinkArrow}>&nbsp;&#9660; </p>
        </div>
      }
      id={`${text}-${desktop ? 'desktop' : 'mobile'}`}
    >
      {children}
    </Dropdown>
  );
};

export default DropdownLink;
