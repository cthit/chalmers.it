import { marked } from 'marked';
import style from './MarkdownView.module.scss';

const MarkdownView = ({ content }: { content: string }) => {
  marked.use({
    pedantic: false,
    breaks: true,
    gfm: true
  });

  const renderMarkdownText = () => {
    const rawMarkup = marked.parse(content);
    return { __html: rawMarkup };
  };

  return (
    <div
      className={style.content}
      dangerouslySetInnerHTML={renderMarkdownText()}
    />
  );
};

export default MarkdownView;
