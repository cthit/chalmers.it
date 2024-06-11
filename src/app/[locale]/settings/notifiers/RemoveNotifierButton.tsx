'use client';

import { removeNotifier } from '@/actions/notifiers';
import ActionButton from '@/components/ActionButton/ActionButton';
import i18nService from '@/services/i18nService';
import { toast } from 'react-toastify';

const RemoveNotifierButton = ({
  id,
  locale
}: {
  id: number;
  locale: string;
}) => {
  const l = i18nService.getLocale(locale);

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
