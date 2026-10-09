'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import i18nService from '@/services/i18nService';
import { toast } from 'react-toastify';

const CopyButton = ({
  locale,
  copyContent
}: {
  locale: string;
  copyContent: string;
}) => {
  const l = i18nService.getLocale(locale);

  const copyLink = () => {
    navigator.clipboard.writeText(copyContent);
    toast(l.editor.linkCopied, { type: 'success' });
  };

  return <ActionButton onClick={copyLink}>{l.editor.copyLink}</ActionButton>;
};

export default CopyButton;
