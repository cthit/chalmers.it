'use client';

import { deletePost } from './actions';
import ActionButton from '@/components/ActionButton/ActionButton';

interface DeletePostButtonProps {
  id: number;
  text: string;
}

const DeletePostButton = ({ id, text }: DeletePostButtonProps) => {
  async function remove() {
    try {
      await deletePost(id);
    } catch {
      console.log('Failed to remove news article');
    }
  }

  return <ActionButton onClick={remove}>{text}</ActionButton>;
};

export default DeletePostButton;
