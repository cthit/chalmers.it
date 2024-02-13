'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import { useState } from 'react';
import { addNotifier } from './actions';
import { useRouter } from 'next/navigation';

const NewNotifierForm = () => {
  const router = useRouter();
  let [type, setType] = useState('DISCORD');
  let [language, setLanguage] = useState('EN');
  let [webhook, setWebhook] = useState('');

  const newNotifier = async () => {
    const notifType = type as 'DISCORD' | 'SLACK';
    const notifLang = language as 'EN' | 'SV';

    await addNotifier(notifType, notifLang, webhook);
    router.refresh();
  };

  return (
    <form>
      <p>Type</p>
      <select onChange={(e) => setType(e.target.value)}>
        <option value="DISCORD">Discord</option>
        <option value="SLACK">Slack</option>
      </select>
      <p>Language</p>
      <select onChange={(e) => setLanguage(e.target.value)}>
        <option value="EN">English</option>
        <option value="SV">Swedish</option>
      </select>
      <p>Webhook URL</p>
      <input type="text" onChange={(e) => setWebhook(e.target.value)} />
      <ActionButton onClick={newNotifier}>Add</ActionButton>
    </form>
  );
};

export default NewNotifierForm;
