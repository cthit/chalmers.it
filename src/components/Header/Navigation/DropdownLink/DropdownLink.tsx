import { Playfair_Display } from 'next/font/google';
import styles from './DropdownLink.module.scss';
import { HTMLAttributes, ReactNode } from 'react';
import Dropdown from '../Dropdown/Dropdown';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '800' });

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
          <p className={playfair.className}>{text} </p>
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
