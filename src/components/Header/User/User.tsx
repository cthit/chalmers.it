import styles from './User.module.scss';

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
      <p>User</p>
      <a href="https://gamma.chalmers.it/me/edit">
        <img src="/settings.svg" />
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
