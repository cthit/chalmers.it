'use client';

import { deletePage } from '@/actions/divisionPages';
import ActionButton from '@/components/ActionButton/ActionButton';

interface DeletePageButtonProps {
  id: number;
  text: string;
}

const DeletePageButton = ({ text, id }: DeletePageButtonProps) => {
  async function remove() {
    try {
      await deletePage(id);
    } catch {
      console.log('Failed to remove division post');
    }
  }

  return <ActionButton onClick={remove}>{text}</ActionButton>;
};

export default DeletePageButton;
