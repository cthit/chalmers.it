'use client';

import style from './MarkdownEditor.module.scss';
import { TextareaHTMLAttributes } from 'react';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  InsertImage,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

const MarkdownEditor = ({
  className
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <MDXEditor
      markdown=""
      plugins={[
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        diffSourcePlugin({
          readOnlyDiff: true
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <DiffSourceToggleWrapper>
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <CodeToggle />
                <InsertImage />
                <CreateLink />
              </DiffSourceToggleWrapper>
            </>
          )
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin()
      ]}
      className={`${className} ${style.editor}`}
      contentEditableClassName={style.contentEditable}
      placeholder={undefined}
    />
  );
};

export default MarkdownEditor;
