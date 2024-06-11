import FallbackImage from '../FallbackImage/FallbackImage';
import styles from './GroupMember.module.scss';

const GroupMember = ({
  pfp,
  name,
  post,
  postStyled
}: {
  pfp: string;
  name: string;
  post: string;
  postStyled?: string;
}) => {
  return (
    <div>
      <FallbackImage
        src={pfp}
        className={styles.picture}
        alt={'Profile picture for ' + name}
      />
      <h3>{name}</h3>
      <p>{postStyled ? `${postStyled} (${post})` : post}</p>
    </div>
  );
};

export default GroupMember;
