'use client';

import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import { useState } from 'react';
import DropdownList from '../DropdownList/DropdownList';
import { marked } from 'marked';
import style from '../NewsPostForm/NewsPostForm.module.scss';
import Popup from 'reactjs-popup';
import DivisionPageService, {
  DivisionPage
} from '@/services/divisionPageService';
import { create, edit } from '@/actions/divisionPages';
import { toast } from 'react-toastify';

const PreviewContentStyle = {
  backgroundColor: '#000000AA'
};

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
}

const DivisionPageForm = (divisionPost: DivisionPostFormProps) => {
  marked.use({
    pedantic: false,
    breaks: true,
    gfm: true
  });

  const [page, setPage] = useState(divisionPost.parentId);
  const [titleEn, setTitleEn] = useState(divisionPost.titleEn ?? '');
  const [titleSv, setTitleSv] = useState(divisionPost.titleSv ?? '');
  const [contentEn, setContentEn] = useState(divisionPost.contentEn ?? '');
  const [contentSv, setContentSv] = useState(divisionPost.contentSv ?? '');
  const [slug, setSlug] = useState(divisionPost.slug ?? '');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContentSv, setPreviewContentSv] = useState({
    __html: marked.parse('')
  });
  const [previewContentEn, setPreviewContentEn] = useState({
    __html: marked.parse('')
  });

  function preview() {
    const markupSv = marked.parse(contentSv);
    setPreviewContentSv({ __html: markupSv });
    const markupEn = marked.parse(contentEn);
    setPreviewContentEn({ __html: markupEn });

    setShowPreview(true);
  }

  async function apply() {
    if (divisionPost.editedId !== undefined) {
      try {
        await toast.promise(
          edit(
            divisionPost.editedId,
            titleEn,
            titleSv,
            contentEn,
            contentSv,
            slug,
            page
          ),
          {
            pending: 'Sparar...',
            success: 'Sidan redigerad!',
            error: 'Kunde inte redigera sidan'
          }
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        await toast.promise(
          create(titleEn, titleSv, contentEn, contentSv, slug, page),
          {
            pending: 'Skapar sida...',
            success: 'Sidan skapad!',
            error: 'Kunde inte skapa sidan'
          }
        );
      } catch (e) {
        console.error(e);
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
              ? 'Redigera undersida'
              : 'Skapa undersida'
            : divisionPost.editedId
              ? 'Redigera sida'
              : 'Skapa sida'}
        </h1>
        <Divider />
        <h2>Skapa under</h2>
        <DropdownList value={page} onChange={(e) => setPage(+e.target.value)}>
          <option value={undefined}>Toppnivå</option>
          {validPages.map((p) => {
            const pad = '\u00A0'.repeat(p.depth);
            return (
              <option key={p.id} value={p.id} disabled={p.disabled}>
                {`${pad}${p.titleSv}`}
              </option>
            );
          })}
        </DropdownList>

        <br />
        <h2>URL-slug</h2>
        <TextArea value={slug} onChange={(e) => setSlug(e.target.value)} />

        <h2>Titel (Eng)</h2>
        <TextArea
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
        />
        <h2>Innehåll (Eng)</h2>
        <MarkdownEditor
          value={contentEn}
          onChange={(e) => setContentEn(e.target.value)}
        />

        <h2>Titel (Sv)</h2>
        <TextArea
          value={titleSv}
          onChange={(e) => setTitleSv(e.target.value)}
        />
        <h2>Innehåll (Sv)</h2>
        <MarkdownEditor
          value={contentSv}
          onChange={(e) => setContentSv(e.target.value)}
        />

        <br />
        <div className={style.actions}>
          <ActionButton onClick={apply}>
            {divisionPost.editedId !== undefined ? 'Redigera' : 'Skapa'}
          </ActionButton>
          <ActionButton onClick={preview}>Förhandsgranska</ActionButton>
        </div>

        <Popup
          modal
          className={style.dialog}
          open={showPreview}
          onClose={() => setShowPreview(false)}
          overlayStyle={PreviewContentStyle}
        >
          <div className={style.dialog}>
            <h1>Förhandsgranskning</h1>
            <Divider />
            <h2>{titleEn}</h2>
            <p dangerouslySetInnerHTML={previewContentEn} />
            <Divider />
            <h2>{titleSv}</h2>
            <p dangerouslySetInnerHTML={previewContentSv} />

            <ActionButton onClick={() => setShowPreview(false)}>
              Stäng
            </ActionButton>
          </div>
        </Popup>
      </>
    );
  }
};
export default DivisionPageForm;
