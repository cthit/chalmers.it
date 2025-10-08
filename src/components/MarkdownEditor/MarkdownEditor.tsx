import {
  defaultValueCtx,
  Editor,
  editorViewCtx,
  editorViewOptionsCtx,
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
import { upload, uploadConfig, Uploader } from '@milkdown/kit/plugin/upload';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { imageBlockComponent } from '@milkdown/kit/component/image-block';
import { callCommand, getMarkdown, replaceAll } from '@milkdown/utils';
import { history } from '@milkdown/kit/plugin/history';
import { clipboard } from '@milkdown/kit/plugin/clipboard';
import React, { useCallback, useEffect } from 'react';
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
import i18nService from '@/services/i18nService';
import FileService from '@/services/fileService';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';

const setCustomLinkRenderer = (ctx: Ctx) => {
  ctx.set(editorViewOptionsCtx, {
    markViews: {
      link: (mark) => {
        const dom = document.createElement('span');
        dom.className = 'md-link-as-span';
        dom.setAttribute(
          'data-href',
          mark.attrs?.href ?? mark.attrs?.url ?? ''
        );
        if (mark.attrs?.title) dom.setAttribute('title', mark.attrs.title);
        dom.tabIndex = 0;
        dom.setAttribute('role', 'link');
        return {
          dom,
          update: (newMark: any) => {
            if (newMark.type !== mark.type) return false;
            if (newMark.attrs?.href !== mark.attrs?.href) {
              dom.setAttribute('data-href', newMark.attrs.href ?? '');
            }
            return true;
          }
        };
      }
    }
  });
};

const setLocalImageViewer = (ctx: Ctx, localFiles: { [key: string]: File }) => {
  ctx.get(listenerCtx).updated((ctx, docChanged) => {
    if (!docChanged) return;
    ctx
      .get(editorViewCtx)
      .dom.querySelectorAll('img')
      .forEach((img) => {
        const match = img
          .getAttribute('src')
          ?.match(/^\/api\/media\/([A-Za-z0-9_-]+)$/);
        if (match && localFiles[match[1]]) {
          const localUrl = URL.createObjectURL(localFiles[match[1]]);
          if (img.src !== localUrl) img.src = localUrl;
        }
      });
  });
};

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

  const tr = view.state.tr.insert(selection.from, emptyImage);
  view.dispatch(tr);
};

interface MilkdownEditorProps {
  defaultMd?: string;
  onUpload?: (files: FileList) => Promise<
    {
      file: File;
      url: string;
    }[]
  >;
  localFiles: {
    [key: string]: File;
  };
  locale: string;
}

const MilkdownEditor = React.forwardRef<
  { getMarkdown: () => string },
  MilkdownEditorProps
>(({ defaultMd, onUpload, locale, localFiles }, ref) => {
  const l = i18nService.getLocale(locale);

  const [markdown, setMarkdown] = React.useState(defaultMd || '');
  const [markdownPreview, setMarkdownPreview] = React.useState('');
  const [viewMode, setViewMode] = React.useState(
    'wysiwyg' as 'wysiwyg' | 'raw' | 'preview'
  );

  const uploader: Uploader = useCallback(
    async (files, schema) => {
      if (!onUpload) return [];

      const urls = await onUpload(files);
      return urls
        .map(({ file, url }) => {
          return FileService.isMimeEmbeddable(file.type)
            ? schema.nodes['image-block'].createAndFill({
                src: url,
                caption: undefined
              })
            : schema.text(file.name || 'File', [
                schema.marks.link.create({ href: url })
              ]);
        })
        .filter((n) => n !== null);
    },
    [onUpload]
  );

  const editor = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);

        configureLinkTooltip(ctx);
        setLocalImageViewer(ctx, localFiles);
        setCustomLinkRenderer(ctx);

        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader
        }));
      })
      .use(listener)
      .use(history)
      .use(clipboard)
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
    [editor]
  );

  // Update uploader in editor when onUpload changes
  useEffect(() => {
    action((ctx) => {
      ctx.update(uploadConfig.key, (prev) => ({
        ...prev,
        uploader
      }));
    });
  }, [uploader, editor]);

  // Update local file replacer in editor when localFiles changes
  useEffect(
    () => action((ctx) => setLocalImageViewer(ctx, localFiles)),
    [localFiles, editor]
  );

  const changeView = useCallback(
    (mode: 'wysiwyg' | 'raw' | 'preview') => {
      if (mode === 'wysiwyg') {
        action(replaceAll(markdown));
      } else if (viewMode === 'wysiwyg') {
        const md: string = editor.get()?.action(getMarkdown()) || '';
        setMarkdown(md);
      }

      if (mode === 'preview') {
        const md: string =
          viewMode === 'wysiwyg'
            ? editor.get()?.action(getMarkdown()) || ''
            : markdown;
        setMarkdownPreview(FileService.replaceLocalFiles(md, localFiles));
      }

      setViewMode(mode);
    },
    [viewMode, markdown, editor, localFiles]
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

  const getMarkdownContent = useCallback((): string => {
    if (viewMode === 'wysiwyg') {
      return editor.get()?.action(getMarkdown()) || '';
    } else {
      return markdown;
    }
  }, [viewMode, editor, markdown]);

  React.useImperativeHandle(ref, () => ({
    getMarkdown: getMarkdownContent
  }));

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
                  title={l.markdown.bold}
                >
                  <BsTypeBold />
                </button>
                <button
                  type="button"
                  onClick={() => action(callCommand(toggleEmphasisCommand.key))}
                  title={l.markdown.italic}
                >
                  <BsTypeItalic />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    action(callCommand(toggleStrikethroughCommand.key))
                  }
                  title={l.markdown.strikethrough}
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
                  {l.markdown.setFormat}
                </option>
                <option value="paragraph">{l.markdown.paragraph}</option>
                <option value="heading1">{l.markdown.heading} 1</option>
                <option value="heading2">{l.markdown.heading} 2</option>
                <option value="heading3">{l.markdown.heading} 3</option>
                <option value="heading4">{l.markdown.heading} 4</option>
                <option value="heading5">{l.markdown.heading} 5</option>
                <option value="heading6">{l.markdown.heading} 6</option>
              </DropdownList>
              <button
                onClick={() => action(insertLink)}
                type="button"
                className={styles.toolbarButton}
                title={l.markdown.link}
              >
                <BsLink />
              </button>
              <button
                onClick={() => action(insertImage)}
                type="button"
                className={styles.toolbarButton}
                title={l.markdown.image}
              >
                <BsImage />
              </button>
            </>
          )}
        </div>
        <div className={styles.buttonGroup}>
          <button
            className={viewMode === 'wysiwyg' ? styles.selectedButton : ''}
            title={l.markdown.richText}
            type="button"
            onClick={() => changeView('wysiwyg')}
          >
            <BsFileEarmarkRichtext />
          </button>
          <button
            className={viewMode === 'raw' ? styles.selectedButton : ''}
            title={l.markdown.raw}
            type="button"
            onClick={() => changeView('raw')}
          >
            <BsMarkdown />
          </button>
          <button
            className={viewMode === 'preview' ? styles.selectedButton : ''}
            title={l.markdown.preview}
            type="button"
            onClick={() => changeView('preview')}
          >
            <BsBook />
          </button>
        </div>
      </div>
      <div className={styles.editor} hidden={viewMode !== 'wysiwyg'}>
        <Milkdown />
      </div>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        hidden={viewMode !== 'raw'}
        className={styles.rawEditor}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => onUpload?.(e.dataTransfer.files)}
      />
      {viewMode === 'preview' && (
        <div className={styles.rawEditor}>
          <MarkdownView content={markdownPreview} allowBlob />
        </div>
      )}
    </>
  );
});

MilkdownEditor.displayName = 'MilkdownEditor';

export const MarkdownEditor = React.forwardRef<
  { getMarkdown: () => string },
  {
    defaultMd?: string;
    onUpload?: (files: FileList) => Promise<
      {
        file: File;
        url: string;
      }[]
    >;
    locale: string;
    localFiles?: {
      [key: string]: File;
    };
  }
>(({ defaultMd, onUpload, locale, localFiles }, ref) => {
  return (
    <MilkdownProvider>
      <MilkdownEditor
        defaultMd={defaultMd}
        onUpload={onUpload}
        ref={ref}
        locale={locale}
        localFiles={localFiles ?? {}}
      />
    </MilkdownProvider>
  );
});

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;
