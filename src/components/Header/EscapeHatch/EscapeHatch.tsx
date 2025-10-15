import Link from 'next/link';
import styles from './EscapeHatch.module.scss';
import i18nService from '@/services/i18nService';

const EscapeHatch = ({ locale }: { locale?: string }) => {
  const l = i18nService.getLocale(locale);
  return (
    <div className={styles.escapeHatch}>
      <Link href="/">
        <picture>
          <img
            className={styles.itlogo}
            src="/itlogo.svg"
            alt="IT-sektionens logga"
          />
        </picture>
      </Link>

      <Link href="/">
        <h1 className={styles.title}>{l.site.title}</h1>
        <h2 className={styles.subtitle}>{l.site.subtitle}</h2>
      </Link>
    </div>
  );
};

export default EscapeHatch;
