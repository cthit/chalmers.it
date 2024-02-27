'use server';
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
      <object data={pfp}>
        <picture>
          <img
            src="/smurf.svg"
            className={styles.picture}
            alt="Profile Picture"
          />
        </picture>
      </object>
      <h3>{name}</h3>
      <p>{postStyled ? `${postStyled} (${post})` : post}</p>
    </div>
  );
};

export default GroupMember;
