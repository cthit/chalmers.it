'use client';

import { editGroupRootPage } from '@/actions/groupRootPages';
import Divider from '@/components/Divider/Divider';
import {
  FormActions,
  LocalizedContentEditor,
  formDataFromUploadQueue,
  useUploadQueue
} from '@/components/Form';
import TextArea from '@/components/TextArea/TextArea';
import { useState } from 'react';
import i18nService from '@/services/i18nService';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface NewPostFormProps {
  id: number;
  contentEn: string;
  contentSv: string;
  slug: string;
  locale: string;
  maxFileSizeBytes?: number;
  maxUploadSizeBytes?: number;
}

const PageForm = (description: NewPostFormProps) => {
  const l = i18nService.getLocale(description.locale);
  const router = useRouter();

  const [contentEn, setContentEn] = useState(description.contentEn);
  const [contentSv, setContentSv] = useState(description.contentSv);
  const [slug, setSlug] = useState(description.slug ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadQueue, dropFiles, removeFile } = useUploadQueue({
    locale: description.locale,
    maxFileSizeBytes: description.maxFileSizeBytes,
    maxUploadSizeBytes: description.maxUploadSizeBytes
  });

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await toast.promise(
        editGroupRootPage(
          description.id,
          contentEn,
          contentSv,
          slug,
          formDataFromUploadQueue(uploadQueue)
        ),
        {
          pending: l.editor.saving,
          success: l.editor.saved,
          error: l.editor.saveError
        }
      );
      router.push(`/groups/${slug}`);
    } catch {
      toast.error(l.pages.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const cancel = () => router.push(`/groups/${description.slug}`);

  return (
    <>
      <h1>{l.pages.editGroupPage}</h1>
      <Divider />
      <form onSubmit={send} aria-busy={isSubmitting}>
        <h2>{l.pages.urlSlug}</h2>
        <TextArea value={slug} onChange={(e) => setSlug(e.target.value)} />

        <h2>{l.editor.content}</h2>
        <LocalizedContentEditor
          locale={description.locale}
          label={l.editor.content}
          contentEn={contentEn}
          contentSv={contentSv}
          onChangeEn={setContentEn}
          onChangeSv={setContentSv}
          uploadQueue={uploadQueue}
          onUpload={dropFiles}
          onRemoveFile={removeFile}
          maxFileSizeBytes={description.maxFileSizeBytes}
          maxUploadSizeBytes={description.maxUploadSizeBytes}
        />

        <FormActions
          locale={description.locale}
          submitLabel={l.general.save}
          submittingLabel={l.editor.saving}
          isSubmitting={isSubmitting}
          onCancel={cancel}
        />
      </form>
    </>
  );
};

export default PageForm;
