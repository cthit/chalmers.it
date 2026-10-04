'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import { removeSponsor } from '@/actions/sponsors';
import i18nService from '@/services/i18nService';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const remove = async () => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
      await removeSponsor(sponsor.id);
      router.refresh();
    }
  };
  return <ActionButton onClick={remove}>{l.general.delete}</ActionButton>;
};

export default RemoveSponsorButton;
