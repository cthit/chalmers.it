'use client';

import { useRouter } from 'next/navigation';
import ActionButton from '@/components/ActionButton/ActionButton';
import { editGroup, removeGroup } from '@/actions/groups';
import { toast } from 'react-toastify';
import { useState } from 'react';
import DivisionGroupService from '@/services/divisionGroupService';
import i18nService from '@/services/i18nService';
import ActionLink from '@/components/ActionButton/ActionLink';
import GammaService from '@/services/gammaService';
import TextArea from '@/components/TextArea/TextArea';
import DropdownList from '@/components/DropdownList/DropdownList';

const EditGroupForm = ({
  locale,
  id,
  typeId,
  superGroupId,
  prettyName,
  priority,
  groupTypes
}: {
  locale: string;
  id: number;
  typeId: number;
  superGroupId: string;
  prettyName: string;
  priority: number;
  groupTypes: Awaited<ReturnType<typeof DivisionGroupService.getGroupTypes>>;
}) => {
  const router = useRouter();
  const l = i18nService.getLocale(locale);
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

    await toast.promise(editGroup(superGroupId, prio, type < 0 ? null : type), {
      pending: 'Editing group...',
      success: 'Group edited!',
      error: 'Failed to edit group'
    });
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{prettyName}</td>
      <td>
        <form onSubmit={edit}>
          <TextArea
            type="number"
            onChange={(e) => setPrio(+e.target.value)}
            value={prio}
          />
        </form>
      </td>
      <td>
        <DropdownList onChange={(e) => setType(+e.target.value)} value={type}>
          {groupTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {l.en ? type.nameEn : type.nameSv}
            </option>
          ))}
        </DropdownList>
      </td>
      <td>
        <ActionButton type="submit" onClick={edit}>
          {l.general.save}
        </ActionButton>{' '}
        <ActionButton type="button" onClick={remove}>
          {l.general.delete}
        </ActionButton>{' '}
        <ActionLink
          target="_blank"
          href={GammaService.gammaUrl + '/super-groups/' + superGroupId}
        >
          {l.settings.groups.showOnGamma}
        </ActionLink>
      </td>
    </tr>
  );
};

export default EditGroupForm;
