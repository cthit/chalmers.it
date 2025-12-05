import FallbackImage from '../FallbackImage/FallbackImage';
import styles from './GroupAvatar.module.scss';

const GroupAvatar = ({
  groupAvatarUrl,
  groupName
}: {
  groupAvatarUrl: string;
  groupName: string;
}) => {
  return (
    <div className={styles.container}>
      <FallbackImage
        src={groupAvatarUrl}
        className={styles.picture}
        alt={'Group avatar for ' + groupName}
      />
    </div>
  );
};

export default GroupAvatar;
