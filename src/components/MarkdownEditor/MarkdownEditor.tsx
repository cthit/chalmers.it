import style from './MarkdownEditor.module.scss';
import { TextareaHTMLAttributes } from 'react';

const MarkdownEditor = ({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return <textarea className={`${style.editor} ${className}`} {...rest} />;
};

export default MarkdownEditor;
