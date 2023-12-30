import ActionButton from '@/components/ActionButton/ActionButton';
import styles from './User.module.scss';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';

const User = async () => {
  const session = await getServerSession(authConfig);
  const image = session?.user?.image;

  return (
    <div className={styles.user}>
      {image === undefined ? (
        <NotLogged />
      ) : (
        <LoggedIn image={session?.user?.image!} />
      )}
    </div>
  );
};

const LoggedIn = ({ image }: { image: string }) => {
  return (
    <a href="https://gamma.chalmers.it/me/edit">
      <picture>
        <img src={image} className={styles.pfp} alt="Profile Picture" />
      </picture>
    </a>
  );
};

const NotLogged = () => {
  return <ActionButton href="/login">Logga in</ActionButton>;
};

export default User;
