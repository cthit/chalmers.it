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
      {/* Render the URL on the page for quick debugging */}
      <div className={styles.url}>{groupAvatarUrl}</div>
    </div>
  );
};

export default GroupAvatar;
