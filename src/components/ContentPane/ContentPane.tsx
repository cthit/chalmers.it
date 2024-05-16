import { HTMLAttributes } from 'react';
import styles from './ContentPane.module.scss';

const ContentPane = ({
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

export default ContentPane;
