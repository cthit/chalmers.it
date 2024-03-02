import styles from './NewsList.module.scss';
import NewsPost from './NewsPost/NewsPost';
import NewsService from '@/services/newsService';
import ActionButton from '../ActionButton/ActionButton';
import SessionService from '@/services/sessionService';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';

interface NewsPostInterface {
  id: number;
  titleSv: string;
  titleEn: string;
  contentSv: string;
  contentEn: string;
  writtenByCid: string;
  createdAt: Date;
  updatedAt: Date;
  writtenFor: {
    prettyName: string;
  } | null;
}

const NewsList = async () => {
  try {
    const news = await NewsService.getPage(1, 10);
    const canPost = await SessionService.isActive().catch(() => false);
    return <News news={news} canPost={canPost} />;
  } catch {
    return <NewsError />;
  }
};

const News = ({
  news,
  canPost
}: {
  news: NewsPostInterface[];
  canPost: boolean;
}) => {
  return (
    <ContentPane>
      <div className={styles.title}>
        <h1>Nyheter</h1>
        {canPost && <ActionButton href="/post/new">Posta nyhet</ActionButton>}
      </div>
      {news.length === 0 && (
        <>
          <Divider />
          <p>Inga nyheter att visa</p>
        </>
      )}
      {news.map((newsPost) => (
        <NewsPost post={newsPost} key={newsPost.id} />
      ))}
    </ContentPane>
  );
};

const NewsError = () => {
  return (
    <div className={styles.list}>
      <h1>Nyheter</h1>
      <Divider />
      <p>Det gick inte att hämta nyheter</p>
    </div>
  );
};

export default NewsList;
