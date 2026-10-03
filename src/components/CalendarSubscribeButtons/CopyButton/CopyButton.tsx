'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import i18nService from '@/services/i18nService';
import { toast } from 'react-toastify';

const CopyButton = ({ locale, href }: { locale: string; href: string }) => {
  const l = i18nService.getLocale(locale);

  const copyLink = () => {
    navigator.clipboard.writeText(href);
    toast(l.events.linkCopied, { type: 'success' });
  };

  return <ActionButton onClick={copyLink}>{l.events.copyLink}</ActionButton>;
};

export default CopyButton;
