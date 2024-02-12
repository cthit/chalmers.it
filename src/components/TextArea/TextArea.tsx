import style from './TextArea.module.scss';
import { ChangeEventHandler } from 'react';

interface TextAreaProps {
  value: string | undefined;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
}

const TextArea = ({ value, onChange }: TextAreaProps) => {
  return (
    <input
      className={style.input}
      type="text"
      value={value}
      onChange={onChange}
    />
  );
};

export default TextArea;
