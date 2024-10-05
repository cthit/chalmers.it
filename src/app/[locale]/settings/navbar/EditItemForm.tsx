'use client';

import { removeItem, updateItem } from '@/actions/navigation';
import ActionButton from '@/components/ActionButton/ActionButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const EditItemForm = ({ item }: { item: any }) => {
  const router = useRouter();
  const [nameEn, setNameEn] = useState(item.nameEn);
  const [nameSv, setNameSv] = useState(item.nameSv);
  const [url, setUrl] = useState(item.url);
  const [priority, setPriority] = useState(item.priority);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    toast
      .promise(updateItem(item.id, nameEn, nameSv, url, priority), {
        pending: 'Editing...',
        success: 'Item edited',
        error: 'Failed to edit item'
      })
      .then(() => router.refresh());
  };

  const handleDelete = async () => {
    toast
      .promise(removeItem(item.id), {
        pending: 'Deleting...',
        success: 'Item deleted',
        error: 'Failed to delete item'
      })
      .then(() => router.refresh());
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name (En)</label>
      <input
        type="text"
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
      />
      <br />
      <label>Name (Sv)</label>
      <input
        type="text"
        value={nameSv}
        onChange={(e) => setNameSv(e.target.value)}
      />
      <br />
      <label>URL</label>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <br />
      <label>Priority</label>
      <input
        type="number"
        value={priority}
        onChange={(e) => setPriority(parseInt(e.target.value))}
      />
      <br />
      <ActionButton type="submit">Save</ActionButton>
      <ActionButton onClick={handleDelete} type="button">
        Delete
      </ActionButton>
    </form>
  );
};

export default EditItemForm;
