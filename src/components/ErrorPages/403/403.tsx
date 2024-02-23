import Link from 'next/link';
import styles from './403.module.scss';

export default function NotFound() {
  return (
    <div className={styles.content}>
      <h1 className={styles.header}>403</h1>

      <p>
        {'You have no power here.'}
        <br />
        If you believe you do, please contact{' '}
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
      </p>
      <Link className={styles.homeLink} href="/">
        Return Home
      </Link>
    </div>
  );
}
