'use client';

import { editType } from '@/actions/groupTypes';
import ActionButton from '@/components/ActionButton/ActionButton';
import DivisionGroupService from '@/services/divisionGroupService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const EditTypeForm = ({
  type
}: {
  type: ArrayElement<
    Awaited<ReturnType<typeof DivisionGroupService.getGroupTypes>>
  >;
}) => {
  const router = useRouter();
  const [priority, setPriority] = useState(type.priority.toString());
  const [nameSv, setNameSv] = useState(type.nameSv);
  const [nameEn, setNameEn] = useState(type.nameEn);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await toast
      .promise(editType(type.id, nameEn, nameSv, +priority), {
        pending: 'Editing type...',
        success: 'Type edited!',
        error: 'Failed to edit type'
      })
      .then(() => router.refresh());
  };

  return (
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
      <ActionButton type="submit">Spara</ActionButton>
    </form>
  );
};

export default EditTypeForm;
