'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import { removeSponsor } from '@/actions/sponsors';
import i18nService from '@/services/i18nService';

const RemoveSponsorButton = ({
  locale,
  sponsor
}: {
  locale: string;
  sponsor: {
    id: number;
  };
}) => {
  const l = i18nService.getLocale(locale);
  const remove = async () => {
    confirm('Are you sure you want to delete this sponsor?') &&
      removeSponsor(sponsor.id);
  };
  return <ActionButton onClick={remove}>{l.general.delete}</ActionButton>;
};

export default RemoveSponsorButton;
