'use client';

import { removeNotifier } from '@/actions/notifiers';
import ActionButton from '@/components/ActionButton/ActionButton';
import i18nService from '@/services/i18nService';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const RemoveNotifierButton = ({
  locale,
  id
}: {
  locale: string;
  id: number;
}) => {
  const l = i18nService.getLocale(locale);
  const router = useRouter();

  const remove = async () => {
    try {
      if (confirm('Are you sure you want to delete this notifier?')) {
        await toast.promise(removeNotifier(id), {
          pending: 'Removing notifier...',
          success: 'Notifier removed!',
          error: 'Failed to remove notifier'
        });
        router.refresh();
      }
    } catch {
      console.log('Failed to remove news article');
    }
  };

  return <ActionButton onClick={remove}>{l.general.delete}</ActionButton>;
};

export default RemoveNotifierButton;
