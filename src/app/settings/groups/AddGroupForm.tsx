'use client';

import { GammaSuperGroup } from '@/models/GammaModels';
import { useState } from 'react';
import { addGroup } from './actions';
import ActionButton from '@/components/ActionButton/ActionButton';
import { useRouter } from 'next/navigation';

const AddGroupForm = ({ gammaGroups }: { gammaGroups: GammaSuperGroup[] }) => {
  const router = useRouter();
  let [newGroup, setNewGroup] = useState('');

  async function importGroup() {
    const group = gammaGroups.find((g) => g.id === newGroup);
    const prettyName = group?.prettyName || group?.name || 'Unnamed Group';

    await addGroup(newGroup, prettyName);
    router.refresh();
  }

  return (
    <>
      <select onChange={(e) => setNewGroup(e.target.value)}>
        {gammaGroups
          .filter((g) => g.type !== 'ALUMNI')
          .map((group) => (
            <option key={group.id} value={group.id}>
              {group.prettyName}
            </option>
          ))}
      </select>
      <ActionButton onClick={importGroup}>Lägg till</ActionButton>
    </>
  );
};

export default AddGroupForm;
