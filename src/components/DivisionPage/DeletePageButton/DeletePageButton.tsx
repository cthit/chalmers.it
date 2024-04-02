'use client';

import { deletePage } from '@/actions/divisionPages';
import ActionButton from '@/components/ActionButton/ActionButton';

interface DeletePageButtonProps {
  id: number;
}

const DeletePageButton = ({ id }: DeletePageButtonProps) => {
  async function remove() {
    try {
      await deletePage(id);
    } catch {
      console.log('Failed to remove division post');
    }
  }

  return <ActionButton onClick={remove}>Radera</ActionButton>;
};

export default DeletePageButton;
