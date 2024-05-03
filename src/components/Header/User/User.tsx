import styles from './User.module.scss';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import LogoutLink from './LogoutLink/LogoutLink';
import LoginButton from './LoginButton/LoginButton';
import Dropdown from '../Navigation/Dropdown/Dropdown';
import Link from 'next/link';
import i18nService from '@/services/i18nService';

const User = async ({ locale }: { locale: string }) => {
  const session = await getServerSession(authConfig);
  const image = session?.user?.image;

  return (
    <div className={styles.user}>
      {image === undefined ? (
        <LoginButton locale={locale} />
      ) : (
        <LoggedIn image={session?.user?.image!} locale={locale} />
      )}
    </div>
  );
};

const LoggedIn = ({ image, locale }: { image: string; locale: string }) => {
  const l = i18nService.getLocale(locale);
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
      <Link href="https://gamma.chalmers.it/me/edit">{l.user.profile}</Link>
      <Link href="/settings">{l.user.settings}</Link>
      <LogoutLink locale={locale} />
    </Dropdown>
  );
};

export default User;
