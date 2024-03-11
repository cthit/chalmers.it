import style from './TextArea.module.scss';
import { ChangeEventHandler } from 'react';

interface TextAreaProps {
  value: string | undefined;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
  className?: string;
}

const TextArea = ({ value, onChange, className }: TextAreaProps) => {
  return (
    <input
      className={`${style.input} ${className}`}
      type="text"
      value={value}
      onChange={onChange}
    />
  );
};

export default TextArea;
