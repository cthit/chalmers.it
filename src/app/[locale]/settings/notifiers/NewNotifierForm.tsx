'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import { useState } from 'react';
import { addNotifier } from '@/actions/notifiers';
import { useRouter } from 'next/navigation';
import DropdownList from '@/components/DropdownList/DropdownList';
import { toast } from 'react-toastify';

const NewNotifierForm = () => {
  const router = useRouter();
  const [type, setType] = useState('DISCORD');
  const [language, setLanguage] = useState('EN');
  const [webhook, setWebhook] = useState('');

  const newNotifier = async () => {
    const notifType = type as 'DISCORD' | 'SLACK';
    const notifLang = language as 'EN' | 'SV';

    try {
      toast.promise(addNotifier(notifType, notifLang, webhook), {
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
    <form>
      <p>Type</p>
      <DropdownList onChange={(e) => setType(e.target.value)}>
        <option value="DISCORD">Discord</option>
        <option value="SLACK">Slack</option>
      </DropdownList>
      <p>Language</p>
      <DropdownList onChange={(e) => setLanguage(e.target.value)}>
        <option value="EN">English</option>
        <option value="SV">Swedish</option>
      </DropdownList>
      <p>Webhook URL</p>
      <input type="text" onChange={(e) => setWebhook(e.target.value)} />
      <ActionButton onClick={newNotifier}>Add</ActionButton>
    </form>
  );
};

export default NewNotifierForm;
