import FallbackImage from '../FallbackImage/FallbackImage';
import styles from './GroupAvatar.module.scss';

const GroupAvatar = ({
  groupAvatarUrl,  
  groupName,
  fetchedURL
}: {
  groupAvatarUrl: string;
  groupName: string;
  fetchedURL: string;
}) => {
  return (
    <div>
      <FallbackImage

        src={groupAvatarUrl}
        className={styles.picture}
        alt={'Group avatar for ' + groupName}
      />
      {/* Render the URL on the page for quick debugging */}
      <div>{groupAvatarUrl}</div>
      <div>{fetchedURL}</div>
      <div>{groupName}</div>
    </div>
  );
};

export default GroupAvatar;
