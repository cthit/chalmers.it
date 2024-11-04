'use client';

import styles from './EditCategoryForm.module.scss';
import { removeCategory, updateCategory } from '@/actions/navigation';
import ActionButton from '@/components/ActionButton/ActionButton';
import TextArea from '@/components/TextArea/TextArea';
import i18nService from '@/services/i18nService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const EditCategoryForm = ({
  locale,
  category
}: {
  locale: string;
  category: any;
}) => {
  const router = useRouter();
  const l = i18nService.getLocale(locale);
  const [nameEn, setNameEn] = useState(category.nameEn);
  const [nameSv, setNameSv] = useState(category.nameSv);
  const [url, setUrl] = useState(category.url);
  const [priority, setPriority] = useState(category.priority);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast
      .promise(updateCategory(category.id, nameEn, nameSv, priority, url), {
        pending: 'Editing...',
        success: 'Category edited',
        error: 'Failed to edit category'
      })
      .then(() => window.location.reload());
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
    <tr className={styles.noBorder}>
      <td>{category.id}</td>
      <td>{l.settings.common.category}</td>
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

export default EditCategoryForm;
