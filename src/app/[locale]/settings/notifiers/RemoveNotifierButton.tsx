'use client';

import { removeNotifier } from '@/actions/notifiers';
import ActionButton from '@/components/ActionButton/ActionButton';

const RemoveNotifierButton = ({ id }: { id: number }) => {
  return (
    <ActionButton onClick={() => removeNotifier(id)}>Ta bort</ActionButton>
  );
};

export default RemoveNotifierButton;
