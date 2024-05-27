import React from 'react';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import style from './MarkdownCheatSheet.module.scss';
import i18nService from '@/services/i18nService';

const MarkdownCheatSheet = ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  return (
    <ContentPane>
      <h1>{l.markdown.title}</h1>
      <Divider />
      <h2>{l.markdown.header}</h2>
      <pre className={style.code}>
        {'# Heading 1\n'}
        {'## Heading 2\n'}
        {'### Heading 3\n'}
        {'#### Heading 4\n'}
        {'##### Heading 5\n'}
        {'###### Heading 6'}
      </pre>

      <h2>{l.markdown.formatting}</h2>
      <pre className={style.code}>
        {'*Italic*\n'}
        {'**Bold**\n'}
        {'~~Strikethrough~~'}
      </pre>

      <h2>{l.markdown.lists}</h2>
      <pre className={style.code}>
        {'- Unordered List Item 1\n'}
        {'- Unordered List Item 2\n'}
        {'- Unordered List Item 3\n\n'}
        {'1. Ordered List Item 1\n'}
        {'2. Ordered List Item 2\n'}
        {'3. Ordered List Item 3'}
      </pre>

      <h2>{l.markdown.links}</h2>
      <pre className={style.code}>[Link Text](https://www.example.com)</pre>

      <h2>{l.markdown.images}</h2>
      <pre className={style.code}>
        ![Alt Text](https://www.example.com/image.jpg)
      </pre>

      <h2>{l.markdown.code}</h2>
      <pre className={style.code}>
        {'```javascript\n'}
        {"const greeting = 'Hello, world!';\n"}
        {'console.log(greeting);\n'}
        {'```'}
      </pre>

      <h2>{l.markdown.tables}</h2>
      <pre className={style.code}>
        {'| Column 1 | Column 2 |\n'}
        {'| -------- | -------- |\n'}
        {'|  Row 1   |  Row 1   |\n'}
        {'|  Row 2   |  Row 2   |'}
      </pre>
    </ContentPane>
  );
};

export default MarkdownCheatSheet;
