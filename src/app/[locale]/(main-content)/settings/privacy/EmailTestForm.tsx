'use client';

import { sendTestEmail } from '@/actions/emailTest';
import ActionButton from '@/components/ActionButton/ActionButton';
import TextArea from '@/components/TextArea/TextArea';
import i18nService from '@/services/i18nService';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './PrivacyNoticeForm.module.scss';

export default function EmailTestForm({ locale }: { locale: string }) {
  const l = i18nService.getLocale(locale);
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState(locale === 'en' ? 'en' : 'sv');
  const [pending, setPending] = useState(false);

  async function send() {
    setPending(true);
    try {
      await toast.promise(sendTestEmail(email, language), {
        pending: l.settings.privacy.sendingTest,
        success: l.settings.privacy.testSent,
        error: l.settings.privacy.testError
      });
    } catch {
      // toast.promise displays the send failure.
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.emailTest}>
      <h2>{l.settings.privacy.testTitle}</h2>
      <p>{l.settings.privacy.testDescription}</p>

      <label htmlFor="test-email">{l.settings.privacy.emailAddress}</label>
      <TextArea
        id="test-email"
        type="email"
        value={email}
        maxLength={320}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="test-email-language">{l.settings.privacy.language}</label>
      <select
        id="test-email-language"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        <option value="sv">{l.settings.privacy.swedish}</option>
        <option value="en">{l.settings.privacy.english}</option>
      </select>

      <ActionButton disabled={pending || !email} onClick={send}>
        {l.settings.privacy.sendTest}
      </ActionButton>
    </section>
  );
}
