import { Poppins } from 'next/font/google';
import styles from './DropdownLink.module.scss';
import { HTMLAttributes } from 'react';
import Dropdown from '../Dropdown/Dropdown';

const poppins = Poppins({ subsets: ['latin'], weight: ['500'] });

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
          <p className={poppins.className}>{text} </p>
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
