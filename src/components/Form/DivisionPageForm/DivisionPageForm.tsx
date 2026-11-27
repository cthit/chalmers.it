'use client';

import { checkValidMoveTargets } from '@/utils/pageMoveTargets';

import { createPage, editPage } from '@/actions/divisionPages';
import Divider from '@/components/Divider/Divider';
import DropdownList from '@/components/DropdownList/DropdownList';
import {
  FormActions,
  LocalizedContentEditor,
  LocalizedTitleFields,
  formDataFromUploadQueue,
  useUploadQueue
} from '@/components/Form';
import TextArea from '@/components/TextArea/TextArea';
import { useState } from 'react';
import type { DivisionPage } from '@/services/divisionPageService';
import { toast } from 'react-toastify';
import i18nService from '@/services/i18nService';
import { useRouter } from 'next/navigation';

interface DivisionPostFormProps {
  pages: DivisionPage[];
  editedId?: number;
  divisionGroupId?: number;
  divisionGroupSlug?: string;
  slug?: string;
  parentId?: number;
  titleEn?: string;
  titleSv?: string;
  contentEn?: string;
  contentSv?: string;
  locale: string;
  priority?: number;
  maxFileSizeBytes?: number;
  maxUploadSizeBytes?: number;
}

const DivisionPageForm = (divisionPost: DivisionPostFormProps) => {
  const l = i18nService.getLocale(divisionPost.locale);
  const router = useRouter();

  const [page, setPage] = useState(divisionPost.parentId);
  const [titleEn, setTitleEn] = useState(divisionPost.titleEn ?? '');
  const [titleSv, setTitleSv] = useState(divisionPost.titleSv ?? '');
  const [contentEn, setContentEn] = useState(divisionPost.contentEn ?? '');
  const [contentSv, setContentSv] = useState(divisionPost.contentSv ?? '');
  const [slug, setSlug] = useState(divisionPost.slug ?? '');
  const [prio, setPrio] = useState(divisionPost.priority ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadQueue, dropFiles, removeFile } = useUploadQueue({
    locale: divisionPost.locale,
    maxFileSizeBytes: divisionPost.maxFileSizeBytes,
    maxUploadSizeBytes: divisionPost.maxUploadSizeBytes
  });

  const isEditing = divisionPost.editedId !== undefined;

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = formDataFromUploadQueue(uploadQueue);

      if (isEditing) {
        await toast.promise(
          editPage(
            divisionPost.editedId!,
            titleEn,
            titleSv,
            contentEn,
            contentSv,
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
      } else {
        await toast.promise(
          createPage(
            titleEn,
            titleSv,
            contentEn,
            contentSv,
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
      }

      if (divisionPost.divisionGroupSlug) {
        router.push(`/groups/${divisionPost.divisionGroupSlug}/${slug}`);
      } else {
        router.push('/groups');
      }
    } catch {
      toast.error(isEditing ? l.pages.saveError : l.pages.createError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const cancel = () =>
    router.push(
      divisionPost.divisionGroupSlug
        ? `/groups/${divisionPost.divisionGroupSlug}`
        : '/groups'
    );

  const maxDepth = divisionPost.divisionGroupId !== undefined ? 1 : 2;
  const validPages = checkValidMoveTargets(
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
      <form onSubmit={apply} aria-busy={isSubmitting}>
        <h2>{l.pages.createUnder}</h2>
        <DropdownList value={page} onChange={(e) => setPage(+e.target.value)}>
          <option value={undefined}>{l.pages.topLevel}</option>
          {validPages.map((p) => {
            const pad = '\u00A0'.repeat(p.depth);
            return (
              <option key={p.id} value={p.id} disabled={p.disabled}>
                {`${pad}${
                  divisionPost.locale === 'en' ? p.titleEn : p.titleSv
                }`}
              </option>
            );
          })}
        </DropdownList>

        <h2>{l.pages.urlSlug}</h2>
        <TextArea value={slug} onChange={(e) => setSlug(e.target.value)} />

        <h2>{l.pages.sortPrio}</h2>
        <TextArea
          value={Number.isNaN(prio) ? 0 : prio}
          onChange={(e) => setPrio(+e.target.value)}
        />

        <h2>{l.pages.title}</h2>
        <LocalizedTitleFields
          locale={divisionPost.locale}
          titleEn={titleEn}
          titleSv={titleSv}
          onChangeEn={setTitleEn}
          onChangeSv={setTitleSv}
          required={false}
        />

        <h2>{l.pages.content}</h2>
        <LocalizedContentEditor
          locale={divisionPost.locale}
          label={l.pages.content}
          contentEn={contentEn}
          contentSv={contentSv}
          onChangeEn={setContentEn}
          onChangeSv={setContentSv}
          uploadQueue={uploadQueue}
          onUpload={dropFiles}
          onRemoveFile={removeFile}
          maxFileSizeBytes={divisionPost.maxFileSizeBytes}
          maxUploadSizeBytes={divisionPost.maxUploadSizeBytes}
        />

        <FormActions
          locale={divisionPost.locale}
          submitLabel={isEditing ? l.general.save : l.general.create}
          submittingLabel={
            isEditing ? l.pages.saving : l.pages.creating
          }
          isSubmitting={isSubmitting}
          onCancel={cancel}
        />
      </form>
    </>
  );
};
export default DivisionPageForm;
