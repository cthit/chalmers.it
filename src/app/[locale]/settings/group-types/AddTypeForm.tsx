'use client';

import { createType } from '@/actions/groupTypes';
import ActionButton from '@/components/ActionButton/ActionButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddTypeForm = () => {
  const router = useRouter();
  const [priority, setPriority] = useState('0');
  const [nameSv, setNameSv] = useState('');
  const [nameEn, setNameEn] = useState('');

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
      <h3>Lägg till typ</h3>
      <form onSubmit={handleSubmit}>
        <label>Namn (en)</label>
        <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        <br />
        <label>Namn (sv)</label>
        <input value={nameSv} onChange={(e) => setNameSv(e.target.value)} />
        <br />
        <label>Prioritet</label>
        <input
          type="number"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <br />
        <ActionButton type="submit">Skapa</ActionButton>
      </form>
    </>
  );
};

export default AddTypeForm;
