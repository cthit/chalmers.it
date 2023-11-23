import styles from './User.module.scss';
import { FaCog } from "react-icons/fa";

const User = () => {
  const isLogged: boolean = true;

  return (
    <div className={styles.user}>
      <img src="/smurf.svg" className={styles.pfp} />
      {isLogged ? <LoggedIn /> : <NotLogged />}
    </div>
  );
};

const LoggedIn = () => {
  return (
    <div className={styles.name}>
      <p>ALongUsernameForTesting</p>
      <a href="https://gamma.chalmers.it/me/edit">
        <FaCog className={styles.settings} />
      </a>
    </div>
  );
};

const NotLogged = () => {
  return (
    <div className={styles.name}>
      <a>Logga in</a>
    </div>
  );
};

export default User;
