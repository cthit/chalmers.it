'use client';

import { createType } from '@/actions/groupTypes';
import ActionButton from '@/components/ActionButton/ActionButton';
import TextArea from '@/components/TextArea/TextArea';
import i18nService from '@/services/i18nService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddTypeForm = ({ locale }: { locale: string }) => {
  const router = useRouter();
  const [priority, setPriority] = useState('0');
  const [nameSv, setNameSv] = useState('');
  const [nameEn, setNameEn] = useState('');
  const l = i18nService.getLocale(locale);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await toast
      .promise(createType(nameEn, nameSv, +priority), {
        pending: 'Creating type...',
        success: 'Type created!',
        error: 'Failed to create type'
      })
      .then(() => router.refresh());
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>{l.settings.common.nameEn}</label>
        <TextArea value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        <br />
        <label>{l.settings.common.nameSv}</label>
        <TextArea value={nameSv} onChange={(e) => setNameSv(e.target.value)} />
        <br />
        <label>{l.settings.common.priority}</label>
        <TextArea
          type="number"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <br />
        <ActionButton type="submit">{l.general.create}</ActionButton>
      </form>
    </>
  );
};

export default AddTypeForm;
