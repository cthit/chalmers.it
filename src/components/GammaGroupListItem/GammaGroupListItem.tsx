'use client';

import { useRouter } from 'next/navigation';
import ActionButton from '../ActionButton/ActionButton';
import { removeGroup } from './actions';

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
        removeGroup(superGroupId);
        router.refresh();
    }

  return (
    <li>
      <h2>{prettyName}</h2>
      <p>
        <strong>Gamma ID:</strong> {superGroupId}
      </p>
      <p>
        <strong>Local ID:</strong> {id}
      </p>
      <ActionButton onClick={remove}>
        Ta bort
      </ActionButton>
    </li>
  );
};

export default GammaGroupListItem;
