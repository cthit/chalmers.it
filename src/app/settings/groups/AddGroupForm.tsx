'use client';

import { GammaSuperGroup } from '@/models/GammaModels';
import { useState } from 'react';
import { addGroup } from './actions';
import ActionButton from '@/components/ActionButton/ActionButton';
import { useRouter } from 'next/navigation';
import DropdownList from '@/components/DropdownList/DropdownList';

const AddGroupForm = ({ gammaGroups }: { gammaGroups: GammaSuperGroup[] }) => {
  const router = useRouter();
  let [newGroup, setNewGroup] = useState('');

  async function importGroup() {
    const group = gammaGroups.find((g) => g.id === newGroup);
    const prettyName = group?.prettyName || group?.name || 'Unnamed Group';
    const slug = group?.name.toLowerCase() || 'unnamed-group';

    await addGroup(newGroup, prettyName, slug);
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
