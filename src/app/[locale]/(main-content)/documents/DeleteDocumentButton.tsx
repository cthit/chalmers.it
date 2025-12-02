'use client';

import { deleteDocument } from '@/actions/documents';
import ActionButton from '@/components/ActionButton/ActionButton';
import { toast } from 'react-toastify';
import i18nService from '@/services/i18nService';

interface DeleteDocumentButtonProps {
  id: number;
  locale: string;
}

const DeleteDocumentButton = ({ id, locale }: DeleteDocumentButtonProps) => {
  const l = i18nService.getLocale(locale);

  async function remove() {
    try {
      confirm(l.docs.confirmDelete) &&
        (await toast.promise(deleteDocument(id), {
          pending: l.docs.deleting,
          success: l.docs.deleted,
          error: l.docs.deleteError
        }));
    } catch {
      console.log('Failed to remove document');
    }
  }

  return <ActionButton onClick={remove}>{l.general.delete}</ActionButton>;
};

export default DeleteDocumentButton;
