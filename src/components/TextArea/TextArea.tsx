import style from './TextArea.module.scss';
import { InputHTMLAttributes } from 'react';

const TextArea = ({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input className={`${style.input} ${className}`} type="text" {...rest} />
  );
};

export default TextArea;
