import Link from 'next/link';
import styles from './not-found.module.scss';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className={styles.content}>
      <h1 className={styles.header}>404</h1>
      <Image
        className={styles.image}
        src="/404.png"
        alt={''}
        width={300}
        height={261}
      />
      <p>
        This is not the site you're looking for!
        <br />
        If you believe it is, please contact{' '}
        <a className={styles.actionLink} href="mailto:digit@chalmers.it">digit@chalmers.it</a> or{' '}
        <a className={styles.actionLink} href="https://github.com/cthit/chalmers.it/issues/new/choose">
          create an issue
        </a>
      </p>
      <Link className={styles.homeLink} href="/">
        Return Home
      </Link>
    </div>
  );
}
