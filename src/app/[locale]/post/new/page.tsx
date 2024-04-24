import NewsPostForm from '@/components/NewsPostForm/NewsPostForm';
import style from './page.module.scss';
import SessionService from '@/services/sessionService';
import ContentPane from '@/components/ContentPane/ContentPane';

export default async function Page() {
  const groups = await SessionService.getActiveGroups();

  return (
    <main className={style.main}>
      <ContentPane>
        <NewsPostForm groups={groups} />
      </ContentPane>
    </main>
  );
}
