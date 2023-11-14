import styles from './User.module.scss';

const Header = () => {
  return (
    <div className={styles.user}>
      <img src="/smurf.svg" className={styles.pfp} />
      <div className={styles.name}>
        <p>User</p>
        <a href="/settings">
          <img src="/settings.svg" />
        </a>
      </div>
    </div>
  );
};

export default Header;
