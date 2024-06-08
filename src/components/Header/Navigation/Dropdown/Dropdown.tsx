import { Playfair_Display } from 'next/font/google';
import styles from './Dropdown.module.scss';
import { HTMLAttributes, ReactNode } from 'react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '800' });

type Props = {
  parent: ReactNode;
  children: ReactNode;
};

const Dropdown = ({
  children,
  parent,
  className,
  ...rest
}: Props & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`${styles.dropdown} ${className}`} {...rest}>
      {parent}
      <div className={styles.dropdownHitbox} />

      <div className={`${styles.dropdownContent}  ${playfair.className}`}>
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
