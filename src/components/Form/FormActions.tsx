'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import i18nService from '@/services/i18nService';
import style from './FormActions.module.scss';

interface FormActionsProps {
  locale: string;
  submitLabel: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
  status?: React.ReactNode;
}

const FormActions = ({
  locale,
  submitLabel,
  submittingLabel = submitLabel,
  isSubmitting = false,
  onCancel,
  status
}: FormActionsProps) => {
  const l = i18nService.getLocale(locale);

  return (
    <div className={style.saveBar}>
      {status && <div className={style.saveStatus}>{status}</div>}
      <div className={style.saveActions}>
        {onCancel && (
          <ActionButton
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            {l.editor.cancel}
          </ActionButton>
        )}
        <ActionButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </ActionButton>
      </div>
    </div>
  );
};

export default FormActions;
