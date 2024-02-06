import style from './DropdownList.module.scss';
import { ChangeEventHandler } from 'react';

interface DropdownListProps {
  children: React.ReactNode;
  onChange: ChangeEventHandler<HTMLSelectElement> | undefined;
}

const DropdownList = ({ children, onChange }: DropdownListProps) => {
  return (
    <select className={style.list} onChange={onChange}>
      {children}
    </select>
  );
};

export default DropdownList;
