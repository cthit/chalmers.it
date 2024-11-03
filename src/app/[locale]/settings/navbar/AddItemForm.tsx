'use client';

import { addItem } from '@/actions/navigation';
import ActionButton from '@/components/ActionButton/ActionButton';
import TextArea from '@/components/TextArea/TextArea';
import i18nService from '@/services/i18nService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddItemForm = ({
  locale,
  categoryId
}: {
  locale: string;
  categoryId: number;
}) => {
  const router = useRouter();
  const l = i18nService.getLocale(locale);
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
      .then(() => router.refresh());
  };

  return (
    <tr>
      <td></td>
      <td>New Item</td>
      <td>
        <TextArea
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />
      </td>
      <td>
        <TextArea
          value={nameSv}
          onChange={(e) => setNameSv(e.target.value)}
        />
      </td>
      <td>
        <TextArea
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
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
        <ActionButton onClick={handleSubmit} type="submit">
          {l.general.add}
        </ActionButton>
      </td>
    </tr>
  );
};

export default AddItemForm;
