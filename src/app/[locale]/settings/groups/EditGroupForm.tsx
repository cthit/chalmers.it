'use client';

import { useRouter } from 'next/navigation';
import ActionButton from '@/components/ActionButton/ActionButton';
import { editGroup, removeGroup } from '@/actions/groups';
import { toast } from 'react-toastify';
import { useState } from 'react';
import DivisionGroupService from '@/services/divisionGroupService';

const EditGroupForm = ({
  id,
  typeId,
  superGroupId,
  prettyName,
  priority,
  groupTypes
}: {
  id: number;
  typeId: number;
  superGroupId: string;
  prettyName: string;
  priority: number;
  groupTypes: Awaited<ReturnType<typeof DivisionGroupService.getGroupTypes>>;
}) => {
  const router = useRouter();
  const [prio, setPrio] = useState(priority);
  const [type, setType] = useState(typeId);

  const remove = async () => {
    confirm('Are you sure you want to delete this group?') &&
      (await toast.promise(removeGroup(superGroupId), {
        pending: 'Removing group...',
        success: 'Group removed!',
        error: 'Failed to remove group'
      }));
    router.refresh();
  };

  const edit = async (e: any) => {
    e.preventDefault();

    await toast.promise(
      editGroup(superGroupId, prio, type < 0 ? null : type),
      {
        pending: 'Editing group...',
        success: 'Group edited!',
        error: 'Failed to edit group'
      }
    );
  };

  return (
    <li>
      <h2>{prettyName}</h2>
      <p>
        <strong>Gamma ID:</strong> {superGroupId}
      </p>
      <p>
        <strong>Local ID:</strong> {id}
      </p>
      <form onSubmit={edit}>
        <label>Priority</label>
        <input
          type="number"
          onChange={(e) => setPrio(+e.target.value)}
          value={prio}
        />
        <br />
        <label>Category</label>
        <select onChange={(e) => setType(+e.target.value)} value={type}>
          {groupTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.nameEn}
            </option>
          ))}
        </select>
        <br />
        <ActionButton type="submit" onClick={edit}>
          Spara
        </ActionButton>
        <ActionButton type="button" onClick={remove}>
          Ta bort
        </ActionButton>
      </form>
    </li>
  );
};

export default EditGroupForm;
