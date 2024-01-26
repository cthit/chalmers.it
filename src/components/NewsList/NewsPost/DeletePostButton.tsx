'use client';

import { deletePost } from './actions';
import ActionButton from '@/components/ActionButton/ActionButton';

interface DeletePostButtonProps {
  id: number;
}

const DeletePostButton = ({ id }: DeletePostButtonProps) => {
  async function remove() {
    try {
        await deletePost(id);
    } catch {
      console.log('Failed to remove news article');
    }
  }

  return <ActionButton onClick={remove}>Radera</ActionButton>;
};

export default DeletePostButton;
