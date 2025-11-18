'use client';

import { editType } from '@/actions/groupTypes';
import ActionButton from '@/components/ActionButton/ActionButton';
import TextArea from '@/components/TextArea/TextArea';
import DivisionGroupService from '@/services/divisionGroupService';
import i18nService from '@/services/i18nService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const EditTypeForm = ({
  type,
  locale
}: {
  type: ArrayElement<
    Awaited<ReturnType<typeof DivisionGroupService.getGroupTypes>>
  >;
  locale: string;
}) => {
  const router = useRouter();
  const [priority, setPriority] = useState(type.priority.toString());
  const [nameSv, setNameSv] = useState(type.nameSv);
  const [nameEn, setNameEn] = useState(type.nameEn);
  const l = i18nService.getLocale(locale);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <tr>
      <td>{type.id}</td>
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
          <TextArea
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
        </form>
      </td>
      <td>
        <ActionButton onClick={handleSubmit}>{l.general.save}</ActionButton>
      </td>
    </tr>
  );
};

export default EditTypeForm;
