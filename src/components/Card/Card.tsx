import { HTMLAttributes } from 'react';
import styles from './Card.module.scss';

const Card = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...rest} className={`${styles.content} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
