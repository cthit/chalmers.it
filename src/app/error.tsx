'use client';

import Link from 'next/link';
import styles from './error.module.scss';
import Image from 'next/image';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.content}>
      <h1 className={styles.header}>500</h1>
      <p>
        I got a bad feeling about this.
        <br />
        Please report this to{' '}
        <a className={styles.actionLink} href="mailto:digit@chalmers.it">
          digit@chalmers.it
        </a>{' '}
        or{' '}
        <a
          className={styles.actionLink}
          href="https://github.com/cthit/chalmers.it/issues/new/choose"
        >
          create an issue
        </a>
        .
      </p>
      <Link className={styles.homeLink} href="/">
        Return Home
      </Link>
    </div>
  );
}
