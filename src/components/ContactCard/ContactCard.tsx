import Link from 'next/link';
import Divider from '../Divider/Divider';
import styles from './ContactCard.module.scss';

const ContactCard = () => {
  return (
    <div>
      <div className={styles.languageToggle}>
        <a className={styles.button}>
          <picture className={styles.flag}>
            <img src="/sweden.svg" alt="Swedish flag"/>
          </picture>
          <p>Svenska</p>
        </a>
        <a className={styles.button}>
          <picture className={styles.flag}>
            <img src="/uk.svg" alt="English flag"/>
          </picture>
          <p>English</p>
        </a>
      </div>
      <Divider />
      <p>
        <strong>POSTADRESS</strong>
      </p>
      <p>Teknologsektionen Informationsteknik</p>
      <p>Toknologgården 2</p>
      <p>412 58 Göteborg</p>
      <br />
      <p>
        <strong>BESÖKSADDRESS</strong>
      </p>
      <p>Hubben 2.2</p>
      <p>Hörsalsvägen 9</p>
      <p>412 58 Göteborg</p>
      <br />
      <p>
        <strong>KONTAKT</strong>
      </p>
      <p>styrit@chalmers.it</p>
      <Divider />
      <p>
        Utvecklad av <Link className={styles.link} href="https://digit.chalmers.it">digIT</Link> |{' '}
        <Link className={styles.link} href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">mer info</Link>{' '}
      </p>
    </div>
  );
};

export default ContactCard;
