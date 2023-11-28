import ActionButton from '@/components/ActionButton/ActionButton';
import styles from './User.module.scss';
import { FaCog } from 'react-icons/fa';

const User = () => {
  const isLogged: boolean = true;

  return (
    <div className={styles.user}>{isLogged ? <LoggedIn /> : <NotLogged />}</div>
  );
};

const LoggedIn = () => {
  return (
    <>
      <img src="/smurf.svg" className={styles.pfp} />
      <div className={styles.name}>
        <p>ALongUsernameForTesting</p>
        <a href="https://gamma.chalmers.it/me/edit">
          <FaCog className={styles.settings} />
        </a>
      </div>
    </>
  );
};

const NotLogged = () => {
  return <ActionButton href="/login">Logga in</ActionButton>;
};

export default User;
