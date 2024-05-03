'use client';

import { GammaSuperGroup } from '@/types/gamma';
import { useState } from 'react';
import { addGroup } from '@/actions/groups';
import ActionButton from '@/components/ActionButton/ActionButton';
import { useRouter } from 'next/navigation';
import DropdownList from '@/components/DropdownList/DropdownList';
import { toast } from 'react-toastify';

const AddGroupForm = ({ gammaGroups }: { gammaGroups: GammaSuperGroup[] }) => {
  const router = useRouter();
  let [newGroup, setNewGroup] = useState('');

  async function importGroup() {
    try {
      await toast.promise(addGroup(newGroup), {
        pending: 'Adding group...',
        success: 'Group added!',
        error: 'Failed to add group'
      });
    } catch (e) {
      console.error(e);
    }

    router.refresh();
  }

  return (
    <>
      <DropdownList onChange={(e) => setNewGroup(e.target.value)}>
        <option value={undefined} hidden>
          Select a group
        </option>
        {gammaGroups
          .filter((g) => g.type !== 'ALUMNI')
          .map((group) => (
            <option key={group.id} value={group.id}>
              {group.prettyName}
            </option>
          ))}
      </DropdownList>
      <ActionButton onClick={importGroup}>Lägg till</ActionButton>
    </>
  );
};

export default AddGroupForm;
