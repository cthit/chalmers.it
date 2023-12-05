import ActionButton from '@/components/ActionButton/ActionButton';
import styles from './User.module.scss';
import Image from 'next/image';

const User = () => {
  const isLogged: boolean = false;

  return (
    <div className={styles.user}>{isLogged ? <LoggedIn /> : <NotLogged />}</div>
  );
};

const LoggedIn = () => {
  return (
    <>
      <div className={styles.name}>
        {/* <p>ALongUsernameForTesting</p> */}
        <a href="https://gamma.chalmers.it/me/edit">
          <Image
            src="/smurf.svg"
            className={styles.pfp}
            alt="profile picture"
          />
        </a>
      </div>
    </>
  );
};

const NotLogged = () => {
  return <ActionButton href="/login">Logga in</ActionButton>;
};

export default User;
