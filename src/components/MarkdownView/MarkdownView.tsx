import { marked } from 'marked';
import style from './MarkdownView.module.scss';
import sanitizeHtml from 'sanitize-html';

const customAllowedTags = sanitizeHtml.defaults.allowedTags.concat([
  'img',
  'del'
]);
const customAllowedSchemes = sanitizeHtml.defaults.allowedSchemes.concat([
  'blob'
]);

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
      allowedTags: customAllowedTags,
      disallowedTagsMode: 'escape',
      allowedSchemes: allowBlob
        ? customAllowedSchemes
        : sanitizeHtml.defaults.allowedSchemes
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
