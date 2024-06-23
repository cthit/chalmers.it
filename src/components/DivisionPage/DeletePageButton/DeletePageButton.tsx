'use client';

import { deletePage } from '@/actions/divisionPages';
import ActionButton from '@/components/ActionButton/ActionButton';
import i18nService from '@/services/i18nService';

interface DeletePageButtonProps {
  id: number;
  locale: string;
}

const DeletePageButton = ({ locale, id }: DeletePageButtonProps) => {
  const l = i18nService.getLocale(locale);
  async function remove() {
    try {
      confirm(l.pages.confirmDelete) && (await deletePage(id));
    } catch {
      console.log('Failed to remove division post');
    }
  }

  return <ActionButton onClick={remove}>{l.general.delete}</ActionButton>;
};

export default DeletePageButton;
