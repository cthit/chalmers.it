'use client';

import { useRouter } from 'next/navigation';
import ActionButton from '../ActionButton/ActionButton';
import { removeGroup } from '@/actions/groups';
import { toast } from 'react-toastify';

const GammaGroupListItem = ({
  id,
  superGroupId,
  prettyName
}: {
  id: number;
  superGroupId: string;
  prettyName: string;
}) => {
  const router = useRouter();

  const remove = async () => {
    confirm('Are you sure you want to delete this group?') &&
      (await toast.promise(removeGroup(superGroupId), {
        pending: 'Removing group...',
        success: 'Group removed!',
        error: 'Failed to remove group'
      }));
    router.refresh();
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
      <ActionButton onClick={remove}>Ta bort</ActionButton>
    </li>
  );
};

export default GammaGroupListItem;
