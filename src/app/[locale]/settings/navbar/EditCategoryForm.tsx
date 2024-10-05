'use client';

import { removeCategory, updateCategory } from '@/actions/navigation';
import ActionButton from '@/components/ActionButton/ActionButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const EditCategoryForm = ({ category }: { category: any }) => {
  const router = useRouter();
  const [nameEn, setNameEn] = useState(category.nameEn);
  const [nameSv, setNameSv] = useState(category.nameSv);
  const [url, setUrl] = useState(category.url);
  const [priority, setPriority] = useState(category.priority);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    toast
      .promise(updateCategory(category.id, nameEn, nameSv, priority, url), {
        pending: 'Editing...',
        success: 'Category edited',
        error: 'Failed to edit category'
      })
      .then(() => router.refresh());
  };

  const handleDelete = async () => {
    confirm(
      'Are you sure you want to delete this category? All sub-items will be deleted!'
    ) &&
      toast
        .promise(removeCategory(category.id), {
          pending: 'Deleting...',
          success: 'Category deleted',
          error: 'Failed to delete category'
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

export default EditCategoryForm;
