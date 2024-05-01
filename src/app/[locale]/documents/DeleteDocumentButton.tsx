'use client';

import { deleteDocument } from '@/actions/documents';
import ActionButton from '@/components/ActionButton/ActionButton';

interface DeleteDocumentButtonProps {
  id: number;
}

const DeleteDocumentButton = ({ id }: DeleteDocumentButtonProps) => {
  async function remove() {
    try {
      await deleteDocument(id);
    } catch {
      console.log('Failed to remove document');
    }
  }

  return <ActionButton onClick={remove}>Radera</ActionButton>;
};

export default DeleteDocumentButton;
