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
  const remove = async () => {
    confirm('Are you sure you want to delete this sponsor?') &&
      removeSponsor(sponsor.id);
  };
  return <ActionButton onClick={remove}>Ta bort</ActionButton>;
};

export default RemoveSponsorButton;
