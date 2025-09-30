'use client';

import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import { useRef, useState } from 'react';
import DropdownList from '../DropdownList/DropdownList';
import styles from '../NewsPostForm/NewsPostForm.module.scss';
import Popup from 'reactjs-popup';
import DivisionPageService, {
  DivisionPage
} from '@/services/divisionPageService';
import { create, edit } from '@/actions/divisionPages';
import { toast } from 'react-toastify';
import i18nService from '@/services/i18nService';
import MarkdownView from '../MarkdownView/MarkdownView';
import FileService, { MediaType } from '@/services/fileService';
import ContentPane from '../ContentPane/ContentPane';

const PreviewContentStyle = {
  backgroundColor: '#000000AA'
};
const validUploadTypes = Object.values(MediaType);

interface DivisionPostFormProps {
  pages: DivisionPage[];
  editedId?: number;
  divisionGroupId?: number;
  slug?: string;
  parentId?: number;
  titleEn?: string;
  titleSv?: string;
  contentEn?: string;
  contentSv?: string;
  locale: string;
  priority?: number;
}

const DivisionPageForm = (divisionPost: DivisionPostFormProps) => {
  const l = i18nService.getLocale(divisionPost.locale);

  const [page, setPage] = useState(divisionPost.parentId);
  const [titleEn, setTitleEn] = useState(divisionPost.titleEn ?? '');
  const [titleSv, setTitleSv] = useState(divisionPost.titleSv ?? '');
  const contentEnRef = useRef<{ getMarkdown: () => string }>(null);
  const contentSvRef = useRef<{ getMarkdown: () => string }>(null);
  const [slug, setSlug] = useState(divisionPost.slug ?? '');
  const [showPreview, setShowPreview] = useState(false);
  const [prio, setPrio] = useState(divisionPost.priority ?? 0);
  const [previewContentSv, setPreviewContentSv] = useState('');
  const [previewContentEn, setPreviewContentEn] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<{
    [key: string]: File;
  }>({});

  const dropFiles = async (f: FileList) => {
    const newQueue = { ...uploadQueue };
    const droppedFiles: { [key: string]: File } = {};
    for (let i = 0; i < f.length; i++) {
      const file = f[i];
      if (!FileService.checkValidFile(file, validUploadTypes)) continue;

      const sha256 = await FileService.fileSha256Browser(file);
      newQueue[sha256] = file;
      droppedFiles[sha256] = file;
    }
    setUploadQueue(newQueue);
    return Object.keys(droppedFiles).map((sha256) => '/api/media/' + sha256);
  };

  const delFile = (sha256: string) => {
    const newQueue = { ...uploadQueue };
    delete newQueue[sha256];
    setUploadQueue(newQueue);
  };

  const copyFile = (sha256: string) => {
    navigator.clipboard.writeText('[Text](/api/media/' + sha256 + ')');
    toast(l.editor.linkCopied, { type: 'success' });
  };

  function preview() {
    setPreviewContentSv(
      FileService.replaceLocalFiles(
        contentSvRef.current!.getMarkdown(),
        uploadQueue
      )
    );
    setPreviewContentEn(
      FileService.replaceLocalFiles(
        contentEnRef.current!.getMarkdown(),
        uploadQueue
      )
    );

    setShowPreview(true);
  }

  async function apply() {
    const formData = new FormData();
    for (const file of Object.values(uploadQueue)) {
      formData.append('file', file);
    }
    if (divisionPost.editedId !== undefined) {
      try {
        await toast.promise(
          edit(
            divisionPost.editedId,
            titleEn,
            titleSv,
            contentEnRef.current!.getMarkdown(),
            contentSvRef.current!.getMarkdown(),
            slug,
            prio,
            formData,
            page
          ),
          {
            pending: l.pages.saving,
            success: l.pages.saved,
            error: l.pages.saveError
          }
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        await toast.promise(
          create(
            titleEn,
            titleSv,
            contentEnRef.current!.getMarkdown(),
            contentSvRef.current!.getMarkdown(),
            slug,
            prio,
            formData,
            divisionPost.divisionGroupId,
            page
          ),
          {
            pending: l.pages.creating,
            success: l.pages.created,
            error: l.pages.createError
          }
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  const maxDepth = divisionPost.divisionGroupId !== undefined ? 1 : 2;
  const validPages = DivisionPageService.checkValidMoveTargets(
    divisionPost.pages,
    maxDepth,
    divisionPost.editedId
  );

  return (
    <>
      <h1>
        {divisionPost.divisionGroupId
          ? divisionPost.editedId
            ? l.pages.editSubpage
            : l.pages.editPage
          : divisionPost.editedId
            ? l.pages.createSubpage
            : l.pages.createPage}
      </h1>
      <Divider />
      <h2>{l.pages.createUnder}</h2>
      <DropdownList value={page} onChange={(e) => setPage(+e.target.value)}>
        <option value={undefined}>{l.pages.topLevel}</option>
        {validPages.map((p) => {
          const pad = '\u00A0'.repeat(p.depth);
          return (
            <option key={p.id} value={p.id} disabled={p.disabled}>
              {`${pad}${divisionPost.locale === 'en' ? p.titleEn : p.titleSv}`}
            </option>
          );
        })}
      </DropdownList>

      <br />
      <h2>{l.pages.urlSlug}</h2>
      <TextArea value={slug} onChange={(e) => setSlug(e.target.value)} />

      <br />
      <h2>{l.pages.sortPrio}</h2>
      <TextArea
        value={Number.isNaN(prio) ? 0 : prio}
        onChange={(e) => setPrio(+e.target.value)}
      />

      <h2>{l.pages.title} (Eng)</h2>
      <TextArea value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      <h2>{l.pages.content} (Eng)</h2>
      <MarkdownEditor
        defaultMd={divisionPost.contentEn}
        ref={contentEnRef}
        onUpload={dropFiles}
        locale={divisionPost.locale}
      />

      <h2>{l.pages.title} (Sv)</h2>
      <TextArea value={titleSv} onChange={(e) => setTitleSv(e.target.value)} />
      <h2>{l.pages.content} (Sv)</h2>
      <MarkdownEditor
        defaultMd={divisionPost.contentSv}
        ref={contentSvRef}
        onUpload={dropFiles}
        locale={divisionPost.locale}
      />

      <br />
      <h2>{l.editor.uploaded}</h2>
      {Object.keys(uploadQueue).length === 0 && <p>{l.editor.noFiles}</p>}
      <ul>
        {Object.entries(uploadQueue).map(([sha256, file]) => (
          <li className={styles.fileActions} key={sha256}>
            <p>{file.name}</p>{' '}
            <ActionButton
              onClick={() => {
                copyFile(sha256);
              }}
            >
              {l.editor.copyLink}
            </ActionButton>{' '}
            <ActionButton
              onClick={() => {
                delFile(sha256);
              }}
            >
              {l.general.delete}
            </ActionButton>
          </li>
        ))}
      </ul>
      <ActionButton onClick={() => fileInputRef.current!.click()}>
        {l.editor.selectFiles}
      </ActionButton>
      <input
        onChange={(e) => dropFiles(e.target.files!)}
        multiple
        ref={fileInputRef}
        type="file"
        hidden
      />

      <br />
      <br />
      <div className={styles.actions}>
        <ActionButton onClick={apply}>
          {divisionPost.editedId !== undefined
            ? l.general.save
            : l.general.create}
        </ActionButton>
        <ActionButton onClick={preview}>Förhandsgranska</ActionButton>
      </div>

      <Popup
        modal
        className={styles.dialog}
        open={showPreview}
        onClose={() => setShowPreview(false)}
        overlayStyle={PreviewContentStyle}
      >
        <ContentPane className={styles.dialog}>
          <h1>{l.pages.preview}</h1>
          <Divider />
          <h2>{titleEn}</h2>
          <MarkdownView content={previewContentEn} allowBlob />
          <Divider />
          <h2>{titleSv}</h2>
          <MarkdownView content={previewContentSv} allowBlob />

          <ActionButton onClick={() => setShowPreview(false)}>
            {l.pages.close}
          </ActionButton>
        </ContentPane>
      </Popup>
    </>
  );
};
export default DivisionPageForm;
