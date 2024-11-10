import styles from './User.module.scss';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import LogoutLink from './LogoutLink/LogoutLink';
import LoginButton from './LoginButton/LoginButton';
import Dropdown from '../Navigation/Dropdown/Dropdown';
import Link from 'next/link';
import i18nService from '@/services/i18nService';
import GammaService from '@/services/gammaService';
import FallbackImage from '@/components/FallbackImage/FallbackImage';

const User = async ({
  locale,
  className
}: {
  locale: string;
  className?: string;
}) => {
  const session = await getServerSession(authConfig);
  const id = session?.user?.id;

  return id === undefined ? (
    <LoginButton locale={locale} />
  ) : (
    <LoggedIn
      className={className}
      image={GammaService.getUserAvatarURL(id)}
      locale={locale}
    />
  );
};

const LoggedIn = ({
  image,
  locale,
  className
}: {
  image: string;
  locale: string;
  className?: string;
}) => {
  const l = i18nService.getLocale(locale);
  return (
    <Dropdown
      className={className}
      parent={
        <div className={styles.pfpContainer}>
          <Link target="_blank" href={GammaService.gammaUrl ?? ''}>
            <FallbackImage
              src={image}
              className={styles.pfp}
              alt="Profile Picture"
              width="3rem"
              height="3rem"
            />
          </Link>
        </div>
      }
      id="user-dropdown"
    >
      <Link target="_blank" href={GammaService.gammaUrl ?? ''}>
        {l.user.profile}
      </Link>
      <Link href="/settings">{l.user.settings}</Link>
      <LogoutLink locale={locale} />
    </Dropdown>
  );
};

export default User;
