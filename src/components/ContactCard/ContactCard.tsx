'use client';

import Link from 'next/link';
import Divider from '../Divider/Divider';
import styles from './ContactCard.module.scss';
import i18nService from '@/services/i18nService';

const ContactCard = ({ locale }: { locale?: string }) => {
  const l = i18nService.getLocale(locale);

  return (
    <div className={styles.contactCard}>
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
        <Link className={styles.link} href="/about">
          {l.footer.moreinfo}
        </Link>{' '}
      </p>
    </div>
  );
};

export default ContactCard;
