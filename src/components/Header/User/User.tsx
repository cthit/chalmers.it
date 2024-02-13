import styles from './User.module.scss';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import LogoutLink from './LogoutLink/LogoutLink';
import LoginButton from './LoginButton/LoginButton';
import Dropdown from '../Navigation/Dropdown/Dropdown';
import Link from 'next/link';

const User = async () => {
  const session = await getServerSession(authConfig);
  const image = session?.user?.image;

  return (
    <div className={styles.user}>
      {image === undefined ? (
        <LoginButton />
      ) : (
        <LoggedIn image={session?.user?.image!} />
      )}
    </div>
  );
};

const LoggedIn = ({ image }: { image: string }) => {
  return (
    <Dropdown
      parent={
        <a href="https://gamma.chalmers.it/me/edit">
          <object data={image}>
            <picture>
              <img
                src="/smurf.svg"
                className={styles.pfp}
                alt="Profile Picture"
              />
            </picture>
          </object>
        </a>
      }
    >
      <Link href="https://gamma.chalmers.it/me/edit">Min profil</Link>
      <Link href="/settings">Inställningar</Link>
      <LogoutLink />
    </Dropdown>
  );
};

export default User;
