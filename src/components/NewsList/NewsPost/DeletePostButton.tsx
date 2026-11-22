'use client';

import { deletePost } from '@/actions/newsPosts';
import ActionButton from '@/components/ActionButton/ActionButton';
import { toast } from 'react-toastify';
import i18nService from '@/services/i18nService';
import { useRouter } from 'next/navigation';

interface DeletePostButtonProps {
  id: number;
  text: string;
  locale: string;
}

const DeletePostButton = ({ id, text, locale }: DeletePostButtonProps) => {
  const router = useRouter();
  const l = i18nService.getLocale(locale);

  async function remove() {
    try {
      if (confirm(l.news.confirmDelete)) {
        await toast.promise(deletePost(id), {
          pending: l.news.deleting,
          success: l.news.deleted,
          error: l.news.deleteError
        });
        router.refresh();
      }
    } catch (e) {
      console.log('Failed to remove news article:', e);
    }
  }

  return <ActionButton onClick={remove}>{text}</ActionButton>;
};

export default DeletePostButton;
