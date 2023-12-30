import Link from 'next/link';
import styles from './ActionButton.module.scss';
import { Playfair_Display } from 'next/font/google';
import { FC } from 'react';

const playfair = Playfair_Display({ subsets: ['latin'] });

interface ActionButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const ActionButton: FC<ActionButtonProps> = ({ children, href, onClick }) => {
  return (
    <Link href={href ?? ""} onClick={onClick} className={`${styles.button} ${playfair.className}`}>
      {children}
    </Link>
  );
};

export default ActionButton;
