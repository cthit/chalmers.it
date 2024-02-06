import style from './MarkdownEditor.module.scss';
import { ChangeEventHandler } from 'react';

interface MarkdownEditorProps {
  value: string | undefined;
  onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
}

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  return (
    <textarea className={style.editor} value={value} onChange={onChange} />
  );
};

export default MarkdownEditor;
