import { marked } from 'marked';
import style from './MarkdownView.module.scss';
import sanitizeHtml from 'sanitize-html';

const MarkdownView = ({
  content,
  allowBlob = false
}: {
  content: string;
  allowBlob?: boolean;
}) => {
  marked.use({
    pedantic: false,
    breaks: true,
    gfm: true
  });

  const renderMarkdownText = () => {
    const rawMarkup = marked.parse(content) as string;
    const sanitizedMarkup = sanitizeHtml(rawMarkup, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      disallowedTagsMode: 'escape',
      allowedSchemes:
        allowBlob && sanitizeHtml.defaults.allowedSchemes.concat(['blob'])
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
