import NewsPostForm from '@/components/NewsPostForm/NewsPostForm';
import style from './page.module.scss';
import SessionService from '@/services/sessionService';

export default async function Page() {
  const groups = await SessionService.getActiveGroups();

  return (
    <main className={style.main}>
      <div className={style.content}>
        <NewsPostForm groups={groups} />
      </div>
    </main>
  );
}
