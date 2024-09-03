'use client';

import { addItem } from '@/actions/navigation';
import ActionButton from '@/components/ActionButton/ActionButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddItemForm = ({ categoryId }: { categoryId: number }) => {
  const router = useRouter();
  const [nameEn, setNameEn] = useState('');
  const [nameSv, setNameSv] = useState('');
  const [url, setUrl] = useState('');
  const [priority, setPriority] = useState(0);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    toast
      .promise(addItem(categoryId, nameEn, nameSv, url, priority), {
        pending: 'Creating...',
        success: 'Item created',
        error: 'Failed to create item'
      })
      .then(() => router.push('/settings/navbar'));
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
      <ActionButton type="submit">Create</ActionButton>
    </form>
  );
};

export default AddItemForm;
