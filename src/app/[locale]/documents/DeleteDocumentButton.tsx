'use client';

import { deleteDocument } from '@/actions/documents';
import ActionButton from '@/components/ActionButton/ActionButton';

interface DeleteDocumentButtonProps {
  id: number;
  text: string;
}

const DeleteDocumentButton = ({ id, text }: DeleteDocumentButtonProps) => {
  async function remove() {
    try {
      await deleteDocument(id);
    } catch {
      console.log('Failed to remove document');
    }
  }

  return <ActionButton onClick={remove}>{text}</ActionButton>;
};

export default DeleteDocumentButton;
