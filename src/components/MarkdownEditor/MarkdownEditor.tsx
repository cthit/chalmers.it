import style from './MarkdownEditor.module.scss';
import { ChangeEventHandler } from 'react';

interface MarkdownEditorProps {
  value: string | undefined;
  onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  className?: string;
}

const MarkdownEditor = ({ value, onChange, className }: MarkdownEditorProps) => {
  return (
    <textarea className={`${style.editor} ${className}`} value={value} onChange={onChange} />
  );
};

export default MarkdownEditor;
