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
  const classes = `${styles.button} ${playfair.className}`;
  return href ? (
    <Link href={href!} className={classes}>
      {children}
    </Link>
  ) : (
    <a onClick={onClick} className={classes}>
      {children}
    </a>
  );
};

export default ActionButton;
