'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Divider from '../Divider/Divider';
import styles from './ContactCard.module.scss';
import i18nService from '@/services/i18nService';

const ContactCard = ({ locale }: { locale: string }) => {
  const router = useRouter();
  const currentPathname = usePathname();

  const l = i18nService.getLocale(locale);

  const switchLocale = (toSv: boolean) => {
    if (currentPathname.startsWith('/en') && toSv) {
      router.push(currentPathname.replace(`/en`, `/sv`));
    } else if (!currentPathname.startsWith('/en') && !toSv) {
      router.push(`/en${currentPathname}`);
    }
  };

  return (
    <div className={styles.contactCard}>
      <div className={styles.languageToggle}>
        <a onClick={() => switchLocale(true)} className={styles.button}>
          <picture className={styles.flag}>
            <img src="/sweden.svg" alt="Swedish flag" />
          </picture>
          <p>Svenska</p>
        </a>
        <a onClick={() => switchLocale(false)} className={styles.button}>
          <picture className={styles.flag}>
            <img src="/uk.svg" alt="English flag" />
          </picture>
          <p>English</p>
        </a>
      </div>
      <Divider />
      <p>
        <strong>{l.footer.postadress}</strong>
      </p>
      <p>Teknologsektionen Informationsteknik</p>
      <p>Teknologgården 2</p>
      <p>412 58 Göteborg</p>
      <br />
      <p>
        <strong>{l.footer.visitadress}</strong>
      </p>
      <p>Hubben 2.2</p>
      <p>Hörsalsvägen 9</p>
      <p>412 58 Göteborg</p>
      <br />
      <p>
        <strong>{l.footer.contact}</strong>
      </p>
      <p>styrit@chalmers.it</p>
      <Divider />
      <p>
        {l.footer.developed}{' '}
        <Link className={styles.link} href="https://digit.chalmers.it">
          digIT
        </Link>{' '}
        |{' '}
        <Link
          className={styles.link}
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        >
          {l.footer.moreinfo}
        </Link>{' '}
      </p>
    </div>
  );
};

export default ContactCard;
