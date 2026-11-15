import {
  defaultValueCtx,
  Editor,
  editorViewCtx,
  editorViewOptionsCtx,
  remarkStringifyOptionsCtx,
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
import {
  $prose,
  $remark,
  callCommand,
  getMarkdown,
  replaceAll
} from '@milkdown/utils';
import { Fragment } from '@milkdown/kit/prose/model';
import { Selection, TextSelection } from '@milkdown/kit/prose/state';
import type { EditorState, Transaction } from '@milkdown/kit/prose/state';
import { keymap } from '@milkdown/kit/prose/keymap';
import { splitBlock } from '@milkdown/kit/prose/commands';
import { splitListItem } from '@milkdown/kit/prose/schema-list';
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
import SegmentedControl from '../SegmentedControl/SegmentedControl';
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
import FileService, { MediaType } from '@/services/fileService';
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

  if (selection.empty) {
    const schema = view.state.schema;
    const text = schema.text('text', [schema.marks.link.create({ href: '' })]);
    view.dispatch(view.state.tr.insert(selection.from, text));
    view.focus();
    ctx.get(linkTooltipAPI.key).addLink(selection.from, selection.from + 4);

    return;
  }

  if (ctx.get(linkTooltipState.key).mode === 'edit') return;

  const has = doc.rangeHasMark(
    selection.from,
    selection.to,
    linkSchema.type(ctx)
  );
  if (has) return;

  ctx.get(linkTooltipAPI.key).addLink(selection.from, selection.to);
};

const insertHardbreak = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void
) => {
  const hardbreak = state.schema.nodes.hardbreak;
  if (!hardbreak) return false;

  const { from, to } = state.selection;
  let tr = state.tr;
  if (from !== to) tr = tr.delete(from, to);
  tr = tr.insert(from, hardbreak.create());
  tr = tr.setSelection(TextSelection.near(tr.doc.resolve(from + 1), 1));
  dispatch?.(tr.scrollIntoView());
  return true;
};

const hardBreaks = $remark('hard-breaks', () => () => (tree: any) => {
  const convert = (node: any) => {
    if (!Array.isArray(node.children)) return;

    for (const child of node.children) {
      if (child.type === 'break') {
        child.data = { ...child.data, isInline: false };
      } else {
        convert(child);
      }
    }
  };

  convert(tree);
});

const enterKeymap = $prose(() =>
  keymap({
    Enter: (state, dispatch, view) => {
      const { $from } = state.selection;
      if ($from.parent.type.name === 'code_block') return false;
      if ($from.parent.type.name === 'heading') {
        return splitBlock(state, dispatch);
      }

      if ($from.node(-1)?.type.name === 'list_item') {
        return splitListItem(state.schema.nodes.list_item)(
          state,
          dispatch,
          view
        );
      }

      return insertHardbreak(state, dispatch);
    },
    'Shift-Enter': (state, dispatch) => {
      const { $from } = state.selection;
      if ($from.parent.type.name === 'code_block') return false;

      if ($from.node(-1)?.type.name === 'list_item') {
        return insertHardbreak(state, dispatch);
      }

      return splitBlock(state, dispatch);
    }
  })
);

interface MilkdownEditorProps {
  defaultMd?: string;
  onUpload?: (files: FileList | File[]) => Promise<
    {
      file: File;
      url: string;
    }[]
  >;
  onChange?: (markdown: string) => void;
  localFiles: {
    [key: string]: File;
  };
  locale: string;
  toolbarStart?: React.ReactNode;
  ariaLabel?: string;
}

const MilkdownEditor = React.forwardRef<
  { getMarkdown: () => string },
  MilkdownEditorProps
>((props, ref) => {
  const {
    defaultMd,
    onUpload,
    onChange,
    locale,
    localFiles,
    toolbarStart,
    ariaLabel
  } = props;
  const l = i18nService.getLocale(locale);

  const [markdown, setMarkdown] = React.useState(defaultMd || '');
  const [markdownPreview, setMarkdownPreview] = React.useState('');
  const [viewMode, setViewMode] = React.useState(
    'wysiwyg' as 'wysiwyg' | 'raw' | 'preview'
  );
  const [formatState, setFormatState] = React.useState({
    strong: false,
    emphasis: false,
    strikethrough: false,
    block: 'format'
  });
  const editorMarkdownRef = React.useRef(defaultMd || '');
  const editorDirtyRef = React.useRef(false);
  const syncingRef = React.useRef(true);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const uploader: Uploader = useCallback(
    async (files, schema) => {
      if (!onUpload) return [];

      const urls = await onUpload(files);
      return urls.flatMap(({ file, url }) =>
        FileService.isMimeEmbeddable(file.type)
          ? [
              schema.nodes.image.create({ src: url, alt: file.name }),
              schema.text(' ')
            ]
          : [
              schema.text(file.name || 'File', [
                schema.marks.link.create({ href: url })
              ]),
              schema.text(' ')
            ]
      );
    },
    [onUpload]
  );

  const updateFormatState = useCallback((ctx: Ctx, selection?: Selection) => {
    const state = ctx.get(editorViewCtx)?.state;
    const activeSelection = selection ?? state?.selection;
    if (!activeSelection) return;

    const doc = activeSelection.$from.doc;
    const schema = doc.type.schema;
    const { from, to, empty } = activeSelection;
    const marks = empty
      ? selection
        ? activeSelection.$from.marks()
        : (state?.storedMarks ?? activeSelection.$from.marks())
      : null;

    const hasMark = (name: string) => {
      const mark = schema.marks[name];
      if (!mark) return false;
      if (!empty) return doc.rangeHasMark(from, to, mark);
      return Boolean(marks?.some((markInstance) => markInstance.type === mark));
    };

    const parent = activeSelection.$from.parent;
    let block = 'format';
    if (parent.type.name === 'heading') {
      block = `heading${parent.attrs.level}`;
    } else if (parent.type.name === 'paragraph') {
      block = 'paragraph';
    }

    const next = {
      strong: hasMark('strong'),
      emphasis: hasMark('emphasis'),
      strikethrough: hasMark('strike_through'),
      block
    };

    setFormatState((prev) =>
      prev.strong === next.strong &&
      prev.emphasis === next.emphasis &&
      prev.strikethrough === next.strikethrough &&
      prev.block === next.block
        ? prev
        : next
    );
  }, []);

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
        ctx.update(remarkStringifyOptionsCtx, (prev) => ({
          ...prev,
          bullet: '-' as const,
          handlers: {
            ...prev.handlers,
            break: () => '  \n'
          }
        }));
        ctx.get(listenerCtx).markdownUpdated((_ctx, md) => {
          editorMarkdownRef.current = md;
          if (syncingRef.current) return;
          editorDirtyRef.current = true;
          onChange?.(md);
        });
        ctx
          .get(listenerCtx)
          .selectionUpdated((ctx, selection) =>
            updateFormatState(ctx, selection)
          );
        ctx.get(listenerCtx).updated((ctx) => updateFormatState(ctx));
        ctx.get(listenerCtx).mounted((ctx) => {
          syncingRef.current = false;
          updateFormatState(ctx);
        });
      })
      .use(listener)
      .use(history)
      .use(clipboard)
      .use(enterKeymap)
      .use(commonmark)
      .use(gfm)
      .use(hardBreaks)
      .use(linkTooltipPlugin)
      .use(upload)
  );

  const action = useCallback(
    (fn: (ctx: Ctx) => void) => {
      if (editor.loading) return;
      editor.get()?.action(fn);
    },
    [editor]
  );

  const applyCommand = useCallback(
    (fn: (ctx: Ctx) => void) => {
      action(fn);
      action((ctx) => updateFormatState(ctx));
    },
    [action, updateFormatState]
  );

  // Update uploader in editor when onUpload changes
  useEffect(() => {
    if (editor.loading) return;
    action((ctx) => {
      if (ctx.isInjected(uploadConfig.key)) {
        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader
        }));
      }
    });
  }, [uploader, editor, action]);

  // Update local file replacer in editor when localFiles changes
  useEffect(
    () => action((ctx) => setLocalImageViewer(ctx, localFiles)),
    [localFiles, editor, action]
  );

  const changeView = useCallback(
    (mode: 'wysiwyg' | 'raw' | 'preview') => {
      if (mode === viewMode) return;

      if (mode === 'wysiwyg') {
        if (markdown !== editorMarkdownRef.current) {
          syncingRef.current = true;
          try {
            action(replaceAll(markdown));
          } finally {
            syncingRef.current = false;
          }
          editorMarkdownRef.current = markdown;
          editorDirtyRef.current = false;
        }
      } else if (viewMode === 'wysiwyg') {
        if (editorDirtyRef.current) {
          const md: string = editor.get()?.action(getMarkdown()) || '';
          setMarkdown(md);
          editorMarkdownRef.current = md;
          editorDirtyRef.current = false;

          if (mode === 'preview') {
            setMarkdownPreview(FileService.replaceLocalFiles(md, localFiles));
          }
        } else if (mode === 'preview') {
          setMarkdownPreview(
            FileService.replaceLocalFiles(markdown, localFiles)
          );
        }
      } else if (mode === 'preview') {
        setMarkdownPreview(FileService.replaceLocalFiles(markdown, localFiles));
      }

      setViewMode(mode);
    },
    [viewMode, markdown, editor, localFiles, action]
  );

  const insertUploadedImages = useCallback(
    async (files: FileList | File[]) => {
      if (!onUpload) return;

      const uploaded = await onUpload(files);
      if (uploaded.length === 0) return;

      action((ctx) => {
        const view = ctx.get(editorViewCtx);
        const { state } = view;
        const images = uploaded
          .filter(({ file }) => FileService.isMimeEmbeddable(file.type))
          .flatMap(({ file, url }) => [
            state.schema.nodes.image.create({ src: url, alt: file.name }),
            state.schema.text(' ')
          ]);
        if (images.length === 0) return;

        const fragment = Fragment.fromArray(images);
        const { $from, from, to } = state.selection;

        if ($from.parent.type.name === 'code_block') {
          const paragraph = state.schema.nodes.paragraph.create(null, fragment);
          const insertPos = $from.after($from.depth);
          const tr = state.tr.insert(insertPos, paragraph);
          tr.setSelection(
            Selection.near(tr.doc.resolve(insertPos + 1 + fragment.size), 1)
          );
          view.dispatch(tr.scrollIntoView());
          view.focus();
          return;
        }

        let tr = state.tr;
        if (from !== to) tr = tr.delete(from, to);
        tr = tr
          .insert(from, fragment)
          .setSelection(
            Selection.near(tr.doc.resolve(from + fragment.size), 1)
          );
        view.dispatch(tr.scrollIntoView());
        view.focus();
      });
    },
    [onUpload, action]
  );

  const setFormat = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      switch (value) {
        case 'paragraph':
          applyCommand(callCommand(turnIntoTextCommand.key));
          break;
        case 'heading1':
          applyCommand(callCommand(wrapInHeadingCommand.key, 1));
          break;
        case 'heading2':
          applyCommand(callCommand(wrapInHeadingCommand.key, 2));
          break;
        case 'heading3':
          applyCommand(callCommand(wrapInHeadingCommand.key, 3));
          break;
        case 'heading4':
          applyCommand(callCommand(wrapInHeadingCommand.key, 4));
          break;
        case 'heading5':
          applyCommand(callCommand(wrapInHeadingCommand.key, 5));
          break;
        case 'heading6':
          applyCommand(callCommand(wrapInHeadingCommand.key, 6));
          break;
        default:
          break;
      }
    },
    [applyCommand]
  );

  const getMarkdownContent = useCallback((): string => {
    if (viewMode === 'wysiwyg' && editorDirtyRef.current) {
      return editor.get()?.action(getMarkdown()) || '';
    }
    return markdown;
  }, [viewMode, editor, markdown]);

  React.useImperativeHandle(ref, () => ({
    getMarkdown: getMarkdownContent
  }));

  return (
    <div role={ariaLabel ? 'group' : undefined} aria-label={ariaLabel}>
      <div className={styles.toolbar}>
        <div>
          {toolbarStart}
          {viewMode === 'wysiwyg' && (
            <>
              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  className={formatState.strong ? styles.selectedButton : ''}
                  aria-pressed={formatState.strong}
                  onClick={() =>
                    applyCommand(callCommand(toggleStrongCommand.key))
                  }
                  title={l.markdown.bold}
                >
                  <BsTypeBold />
                </button>
                <button
                  type="button"
                  className={formatState.emphasis ? styles.selectedButton : ''}
                  aria-pressed={formatState.emphasis}
                  onClick={() =>
                    applyCommand(callCommand(toggleEmphasisCommand.key))
                  }
                  title={l.markdown.italic}
                >
                  <BsTypeItalic />
                </button>
                <button
                  type="button"
                  className={
                    formatState.strikethrough ? styles.selectedButton : ''
                  }
                  aria-pressed={formatState.strikethrough}
                  onClick={() =>
                    applyCommand(callCommand(toggleStrikethroughCommand.key))
                  }
                  title={l.markdown.strikethrough}
                >
                  <BsTypeStrikethrough />
                </button>
              </div>
              <DropdownList
                value={formatState.block}
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
                onClick={() => imageInputRef.current?.click()}
                type="button"
                className={styles.toolbarButton}
                title={l.markdown.image}
              >
                <BsImage />
              </button>
              <input
                accept={FileService.getValidMimes([MediaType.Image]).join(',')}
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  e.target.value = '';
                  if (files.length > 0) void insertUploadedImages(files);
                }}
                ref={imageInputRef}
                type="file"
                hidden
              />
            </>
          )}
        </div>
        <SegmentedControl
          value={viewMode}
          ariaLabel={l.markdown.viewMode}
          className={styles.viewModes}
          options={[
            {
              value: 'wysiwyg',
              label: <BsFileEarmarkRichtext />,
              title: l.markdown.richText,
              ariaLabel: l.markdown.richText
            },
            {
              value: 'raw',
              label: <BsMarkdown />,
              title: l.markdown.raw,
              ariaLabel: l.markdown.raw
            },
            {
              value: 'preview',
              label: <BsBook />,
              title: l.markdown.preview,
              ariaLabel: l.markdown.preview
            }
          ]}
          onChange={(mode) => changeView(mode as 'wysiwyg' | 'raw' | 'preview')}
        />
      </div>
      <div className={styles.editor} hidden={viewMode !== 'wysiwyg'}>
        <Milkdown />
      </div>
      {viewMode === 'wysiwyg' && (
        <p className={styles.hint}>{l.markdown.enterHint}</p>
      )}
      <textarea
        aria-label={ariaLabel}
        value={markdown}
        onChange={(e) => {
          setMarkdown(e.target.value);
          onChange?.(e.target.value);
        }}
        hidden={viewMode !== 'raw'}
        className={styles.rawEditor}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={async (e) => {
          e.preventDefault();
          const textarea = e.currentTarget;
          const files = e.dataTransfer.files;
          if (!onUpload || files.length === 0) return;

          const uploaded = await onUpload(files);
          if (uploaded.length === 0) return;

          const links = uploaded
            .map(({ file, url }) =>
              FileService.isMimeEmbeddable(file.type)
                ? `![${file.name}](${url})`
                : `[${file.name}](${url})`
            )
            .join(' ');
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const next = `${textarea.value.slice(0, start)}${links}${textarea.value.slice(
            end
          )}`;
          setMarkdown(next);
          onChange?.(next);

          requestAnimationFrame(() => {
            textarea.focus();
            const position = start + links.length;
            textarea.setSelectionRange(position, position);
          });
        }}
      />
      {viewMode === 'preview' && (
        <div className={styles.rawEditor}>
          <MarkdownView content={markdownPreview} allowBlob />
        </div>
      )}
    </div>
  );
});

MilkdownEditor.displayName = 'MilkdownEditor';

export const MarkdownEditor = React.forwardRef<
  { getMarkdown: () => string },
  {
    defaultMd?: string;
    onUpload?: (files: FileList | File[]) => Promise<
      {
        file: File;
        url: string;
      }[]
    >;
    onChange?: (markdown: string) => void;
    locale: string;
    localFiles?: {
      [key: string]: File;
    };
    toolbarStart?: React.ReactNode;
    ariaLabel?: string;
  }
>((props, ref) => {
  const {
    defaultMd,
    onUpload,
    onChange,
    locale,
    localFiles,
    toolbarStart,
    ariaLabel
  } = props;
  return (
    <MilkdownProvider>
      <MilkdownEditor
        defaultMd={defaultMd}
        onUpload={onUpload}
        onChange={onChange}
        ref={ref}
        locale={locale}
        localFiles={localFiles ?? {}}
        toolbarStart={toolbarStart}
        ariaLabel={ariaLabel}
      />
    </MilkdownProvider>
  );
});

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;
