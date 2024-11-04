'use client';

import { GammaSuperGroup } from '@/types/gamma';
import { useState } from 'react';
import { addGroup } from '@/actions/groups';
import ActionButton from '@/components/ActionButton/ActionButton';
import { useRouter } from 'next/navigation';
import DropdownList from '@/components/DropdownList/DropdownList';
import { toast } from 'react-toastify';
import i18nService from '@/services/i18nService';

const AddGroupForm = ({
  gammaGroups,
  locale
}: {
  gammaGroups: GammaSuperGroup[];
  locale: string;
}) => {
  const router = useRouter();
  const l = i18nService.getLocale(locale);
  const [newGroup, setNewGroup] = useState('');

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
    <tr>
      <td />
      <td>
        <DropdownList onChange={(e) => setNewGroup(e.target.value)}>
          <option value={undefined} hidden>
            {l.settings.groups.select}
          </option>
          {gammaGroups
            .filter((g) => g.type !== 'ALUMNI')
            .map((group) => (
              <option key={group.id} value={group.id}>
                {group.prettyName}
              </option>
            ))}
        </DropdownList>
      </td>
      <td />
      <td />
      <td>
        <ActionButton onClick={importGroup}>
          {l.settings.groups.import}
        </ActionButton>
      </td>
    </tr>
  );
};

export default AddGroupForm;
