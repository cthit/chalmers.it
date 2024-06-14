import { marked } from 'marked';
import style from './MarkdownView.module.scss';
import sanitizeHtml from 'sanitize-html';

const MarkdownView = ({ content }: { content: string }) => {
  marked.use({
    pedantic: false,
    breaks: true,
    gfm: true
  });

  const renderMarkdownText = () => {
    const rawMarkup = marked.parse(content) as string;
    const sanitizedMarkup = sanitizeHtml(rawMarkup, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      disallowedTagsMode: 'escape'
    });
    return { __html: sanitizedMarkup };
  };

  return (
    <div
      className={style.content}
      dangerouslySetInnerHTML={renderMarkdownText()}
    />
  );
};

export default MarkdownView;
