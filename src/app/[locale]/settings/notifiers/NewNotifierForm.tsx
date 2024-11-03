'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import { useState } from 'react';
import { addNotifier } from '@/actions/notifiers';
import { useRouter } from 'next/navigation';
import DropdownList from '@/components/DropdownList/DropdownList';
import { toast } from 'react-toastify';
import i18nService from '@/services/i18nService';
import TextArea from '@/components/TextArea/TextArea';

const NewNotifierForm = ({ locale }: { locale: string }) => {
  const router = useRouter();
  const l = i18nService.getLocale(locale);
  const [type, setType] = useState('SLACK');
  const [language, setLanguage] = useState('SV');
  const [webhook, setWebhook] = useState('');

  const newNotifier = async () => {
    const notifType = type as 'DISCORD' | 'SLACK';
    const notifLang = language as 'EN' | 'SV';

    try {
      await toast.promise(addNotifier(notifType, notifLang, webhook), {
        pending: 'Adding notifier...',
        success: 'Notifier added!',
        error: 'Failed to add notifier'
      });
    } catch (e) {
      console.error(e);
    }
    router.refresh();
  };

  return (
    <tr>
      <td>
        <DropdownList onChange={(e) => setType(e.target.value)}>
          <option value="SLACK">Slack</option>
          <option value="DISCORD">Discord</option>
        </DropdownList>
      </td>
      <td>
        <DropdownList onChange={(e) => setLanguage(e.target.value)}>
          <option value="SV">Swedish</option>
          <option value="EN">English</option>
        </DropdownList>
      </td>
      <td>
        <TextArea onChange={(e) => setWebhook(e.target.value)} />
      </td>
      <td>
        <ActionButton onClick={newNotifier}>{l.general.add}</ActionButton>
      </td>
    </tr>
  );
};

export default NewNotifierForm;
