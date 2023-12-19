import Link from 'next/link'
import styles from './not-found.module.scss';
import Image from 'next/image';
 
export default function NotFound() {
  return (
    <div className={styles.content}>
      <h1 className={styles.header}>404</h1>
      <Image src="/404.png" alt={''} width={300} height={261} />
      <p>This is not the site you're looking for!</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
