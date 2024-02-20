import style from './DropdownList.module.scss';
import { ChangeEventHandler } from 'react';

interface DropdownListProps {
  children: React.ReactNode;
  onChange: ChangeEventHandler<HTMLSelectElement> | undefined;
  className?: string;
}

const DropdownList = ({ children, onChange, className }: DropdownListProps) => {
  return (
    <select className={`${style.list} ${className}`} onChange={onChange}>
      {children}
    </select>
  );
};

export default DropdownList;
