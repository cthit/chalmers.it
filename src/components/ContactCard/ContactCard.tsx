import Link from 'next/link';
import Divider from '../Divider/Divider';
import styles from './ContactCard.module.scss';

const ContactCard = () => {
  return (
    <div>
      <div className={styles.languageToggle}>
        <div className={styles.swedish}>
          <picture>
            <img className={styles.flag} src="/sweden.svg" alt="Swedish flag"/>
          </picture>
          <p>Svenska</p>
        </div>
        <div className={styles.english}>
          <picture>
            <img className={styles.flag} src="/uk.svg" alt="English flag"/>
          </picture>
          <p>English</p>
        </div>
      </div>
      <Divider />
      <p>
        <strong>POSTADRESS</strong>
      </p>
      <p>Teknologsektion Informationsteknik</p>
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
        Utvecklad av <Link href="https://digit.chalmers.it">digIT</Link> |{' '}
        <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">mer info</Link>{' '}
      </p>
    </div>
  );
};

export default ContactCard;
