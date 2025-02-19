'use client';

import { removeItem, updateItem } from '@/actions/navigation';
import ActionButton from '@/components/ActionButton/ActionButton';
import TextArea from '@/components/TextArea/TextArea';
import i18nService from '@/services/i18nService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const EditItemForm = ({ locale, item }: { locale: string; item: any }) => {
  const router = useRouter();
  const l = i18nService.getLocale(locale);
  const [nameEn, setNameEn] = useState(item.nameEn);
  const [nameSv, setNameSv] = useState(item.nameSv);
  const [url, setUrl] = useState(item.url);
  const [priority, setPriority] = useState(item.priority);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast
      .promise(updateItem(item.id, nameEn, nameSv, url, priority), {
        pending: 'Editing...',
        success: 'Item edited',
        error: 'Failed to edit item'
      })
      .then(() => window.location.reload());
  };

  const handleDelete = async () => {
    confirm('Are you sure you want to delete this item?') &&
      toast
        .promise(removeItem(item.id), {
          pending: 'Deleting...',
          success: 'Item deleted',
          error: 'Failed to delete item'
        })
        .then(() => router.refresh());
  };

  return (
    <tr>
      <td>{item.id}</td>
      <td>{l.settings.navbar.item}</td>
      <td>
        <form onSubmit={handleSubmit}>
          <TextArea
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
          />
        </form>
      </td>
      <td>
        <form onSubmit={handleSubmit}>
          <TextArea
            value={nameSv}
            onChange={(e) => setNameSv(e.target.value)}
          />
        </form>
      </td>
      <td>
        <form onSubmit={handleSubmit}>
          <TextArea value={url} onChange={(e) => setUrl(e.target.value)} />
        </form>
      </td>
      <td>
        <form onSubmit={handleSubmit}>
          <TextArea
            type="number"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
          />
        </form>
      </td>
      <td>
        <ActionButton onClick={handleSubmit}>{l.general.save}</ActionButton>{' '}
        <ActionButton onClick={handleDelete}>{l.general.delete}</ActionButton>
      </td>
    </tr>
  );
};

export default EditItemForm;
