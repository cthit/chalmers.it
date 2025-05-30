'use client';

import styles from './AddCategoryForm.module.scss';
import { addCategory } from '@/actions/navigation';
import ActionButton from '@/components/ActionButton/ActionButton';
import TextArea from '@/components/TextArea/TextArea';
import i18nService from '@/services/i18nService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddCategoryForm = ({ locale }: { locale: string }) => {
  const router = useRouter();
  const l = i18nService.getLocale(locale);
  const [nameEn, setNameEn] = useState('');
  const [nameSv, setNameSv] = useState('');
  const [url, setUrl] = useState('');
  const [priority, setPriority] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast
      .promise(addCategory(nameEn, nameSv, priority, url), {
        pending: 'Creating...',
        success: 'Category created',
        error: 'Failed to create category'
      })
      .then(() => router.refresh());
  };

  return (
    <tr className={styles.noBorder}>
      <td />
      <td>{l.settings.navbar.newCategory}</td>
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
        <ActionButton onClick={handleSubmit}>{l.general.add}</ActionButton>
      </td>
    </tr>
  );
};

export default AddCategoryForm;
