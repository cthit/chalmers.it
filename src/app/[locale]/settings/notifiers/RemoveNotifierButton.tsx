'use client';

import { removeNotifier } from '@/actions/notifiers';
import ActionButton from '@/components/ActionButton/ActionButton';
import { toast } from 'react-toastify';

const RemoveNotifierButton = ({ id }: { id: number }) => {
  const remove = async () => {
    try {
      await toast.promise(removeNotifier(id), {
        pending: 'Removing notifier...',
        success: 'Notifier removed!',
        error: 'Failed to remove notifier'
      });
    } catch {
      console.log('Failed to remove news article');
    }
  };

  return <ActionButton onClick={remove}>Ta bort</ActionButton>;
};

export default RemoveNotifierButton;
