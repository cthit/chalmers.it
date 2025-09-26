import {
  defaultValueCtx,
  Editor,
  editorViewCtx,
  rootCtx
} from '@milkdown/kit/core';
import { gfm, toggleStrikethroughCommand } from '@milkdown/kit/preset/gfm';
import {
  commonmark,
  linkSchema,
  toggleEmphasisCommand,
  toggleStrongCommand,
  turnIntoTextCommand,
  wrapInHeadingCommand
} from '@milkdown/kit/preset/commonmark';
import { upload } from '@milkdown/kit/plugin/upload';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { imageBlockComponent } from '@milkdown/kit/component/image-block';
import { callCommand, getMarkdown, replaceAll } from '@milkdown/utils';
import React, { useCallback } from 'react';
import styles from './MarkdownEditor.module.scss';
import {
  configureLinkTooltip,
  linkTooltipPlugin,
  linkTooltipAPI,
  linkTooltipState
} from '@milkdown/kit/component/link-tooltip';
import { Ctx } from '@milkdown/kit/ctx';
import MarkdownView from '../MarkdownView/MarkdownView';
import DropdownList from '../DropdownList/DropdownList';
import {
  BsBook,
  BsFileEarmarkRichtext,
  BsImage,
  BsLink,
  BsMarkdown,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough
} from 'react-icons/bs';

const insertLink = (ctx: Ctx) => {
  const view = ctx.get(editorViewCtx);
  const { selection, doc } = view.state;

  if (selection.empty) return;

  if (ctx.get(linkTooltipState.key).mode === 'edit') return;

  const has = doc.rangeHasMark(
    selection.from,
    selection.to,
    linkSchema.type(ctx)
  );
  if (has) return;

  ctx.get(linkTooltipAPI.key).addLink(selection.from, selection.to);
};

const insertImage = (ctx: Ctx) => {
  const view = ctx.get(editorViewCtx);
  const { selection } = view.state;

  const emptyImage = view.state.schema.nodes['image-block'].createAndFill();
  if (!emptyImage) return;

  let tr = view.state.tr.insert(selection.from, emptyImage);
  view.dispatch(tr);
};

const MilkdownEditor: React.FC = ({ ...rest }) => {
  const [markdown, setMarkdown] = React.useState('');
  const [viewMode, setViewMode] = React.useState(
    'wysiwyg' as 'wysiwyg' | 'raw' | 'preview'
  );

  const editor = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);

        configureLinkTooltip(ctx);
      })
      .use(commonmark)
      .use(gfm)
      .use(linkTooltipPlugin)
      .use(imageBlockComponent)
      .use(upload)
  );

  const action = useCallback(
    (fn: (ctx: Ctx) => void) => {
      if (editor.loading) return;
      editor.get()?.action(fn);
    },
    [editor.loading]
  );

  const changeView = useCallback(
    (mode: 'wysiwyg' | 'raw' | 'preview') => {
      if (mode === 'wysiwyg') {
        editor.get()?.action(replaceAll(markdown));
      } else if (viewMode === 'wysiwyg') {
        const md = editor.get()?.action(getMarkdown()) || '';
        setMarkdown(md);
      }

      setViewMode(mode);
    },
    [viewMode, markdown]
  );

  const setFormat = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      switch (value) {
        case 'paragraph':
          action(callCommand(turnIntoTextCommand.key));
          break;
        case 'heading1':
          action(callCommand(wrapInHeadingCommand.key, 1));
          break;
        case 'heading2':
          action(callCommand(wrapInHeadingCommand.key, 2));
          break;
        case 'heading3':
          action(callCommand(wrapInHeadingCommand.key, 3));
          break;
        case 'heading4':
          action(callCommand(wrapInHeadingCommand.key, 4));
          break;
        case 'heading5':
          action(callCommand(wrapInHeadingCommand.key, 5));
          break;
        case 'heading6':
          action(callCommand(wrapInHeadingCommand.key, 6));
          break;
        default:
          break;
      }
    },
    [action]
  );

  return (
    <>
      <div className={styles.toolbar}>
        <div>
          {viewMode === 'wysiwyg' && (
            <>
              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={() => action(callCommand(toggleStrongCommand.key))}
                >
                  <BsTypeBold />
                </button>
                <button
                  type="button"
                  onClick={() => action(callCommand(toggleEmphasisCommand.key))}
                >
                  <BsTypeItalic />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    action(callCommand(toggleStrikethroughCommand.key))
                  }
                >
                  <BsTypeStrikethrough />
                </button>
              </div>
              <DropdownList
                value="format"
                onChange={setFormat}
                className={styles.toolbarDropdown}
              >
                <option disabled hidden value="format">
                  Set format...
                </option>
                <option value="paragraph">Paragraph</option>
                <option value="heading1">Heading 1</option>
                <option value="heading2">Heading 2</option>
                <option value="heading3">Heading 3</option>
                <option value="heading4">Heading 4</option>
                <option value="heading5">Heading 5</option>
                <option value="heading6">Heading 6</option>
              </DropdownList>
              <button
                onClick={() => action(insertLink)}
                type="button"
                className={styles.toolbarButton}
              >
                <BsLink />
              </button>
              <button
                onClick={() => action(insertImage)}
                type="button"
                className={styles.toolbarButton}
              >
                <BsImage />
              </button>
            </>
          )}
        </div>
        <div className={styles.buttonGroup}>
          <button
            className={viewMode === 'wysiwyg' ? styles.selectedButton : ''}
            title="Switch to rich text"
            type="button"
            onClick={() => changeView('wysiwyg')}
          >
            <BsFileEarmarkRichtext />
          </button>
          <button
            className={viewMode === 'raw' ? styles.selectedButton : ''}
            title="Switch to raw"
            type="button"
            onClick={() => changeView('raw')}
          >
            <BsMarkdown />
          </button>
          <button
            className={viewMode === 'preview' ? styles.selectedButton : ''}
            title="Switch to preview"
            type="button"
            onClick={() => changeView('preview')}
          >
            <BsBook />
          </button>
        </div>
      </div>
      <div className={styles.editor} hidden={viewMode !== 'wysiwyg'}>
        <Milkdown {...rest} />
      </div>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        hidden={viewMode !== 'raw'}
        className={styles.rawEditor}
      />
      {viewMode === 'preview' && (
        <div className={styles.rawEditor}>
          <MarkdownView content={markdown} />
        </div>
      )}
    </>
  );
};

export const MilkdownEditorWrapper: React.FC = () => {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  );
};

export default MilkdownEditorWrapper;
