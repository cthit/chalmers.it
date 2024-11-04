import style from './Table.module.scss';
import { TableHTMLAttributes } from 'react';

const Table = ({
  className,
  ...rest
}: TableHTMLAttributes<HTMLTableElement>) => {
  return <table className={`${style.table} ${className}`} {...rest} />;
};

export default Table;
