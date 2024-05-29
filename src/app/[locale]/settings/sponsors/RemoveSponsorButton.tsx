'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import { removeSponsor } from '@/actions/sponsors';

const RemoveSponsorButton = ({
  sponsor
}: {
  sponsor: {
    id: number;
  };
}) => {
  return (
    <ActionButton onClick={() => removeSponsor(sponsor.id)}>
      Ta bort
    </ActionButton>
  );
};

export default RemoveSponsorButton;
