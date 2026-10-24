import ContentPane from '../ContentPane/ContentPane';
import FallbackImage from '../FallbackImage/FallbackImage';
import styles from './GroupMember.module.scss';
import GammaService from '@/services/gammaService';
import { GammaGroupMember } from '@/types/gamma';
import { FaNewspaper, FaUser } from 'react-icons/fa6';
import ActionLink from '../ActionButton/ActionLink';
import i18nService from '@/services/i18nService';

const GroupMember = ({
  member,
  locale
}: {
  member: GammaGroupMember;
  locale: string;
}) => {
  const l = i18nService.getLocale(locale);

  const pfp = GammaService.getUserAvatarURL(member.user.id);
  const url = GammaService.getUserURL(member.user.id);
  const postName = locale === 'en' ? member.post.enName : member.post.svName;
  return (
    <ContentPane>
      <div className={styles.groupMember}>
        <FallbackImage
          src={pfp}
          className={styles.picture}
          alt={'Profile picture for ' + member.user.nick}
        />
        <div>
          <h3>{member.user.nick}</h3>
          <p>
            {member.unofficialPostName ? member.unofficialPostName : postName}
          </p>
          {member.unofficialPostName !== undefined && (
            <p className={styles.secondaryPost}>{postName}</p>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <ActionLink
          className={styles.link}
          href={`/post/search?uid=${member.user.id}`}
        >
          <FaNewspaper /> {l.groups.memberPosts}
        </ActionLink>
        <ActionLink
          variant="secondary"
          target="_blank"
          className={styles.link}
          href={url}
        >
          <FaUser /> {l.groups.memberProfile}
        </ActionLink>
      </div>
    </ContentPane>
  );
};

export default GroupMember;
