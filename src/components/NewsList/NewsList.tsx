import styles from './NewsList.module.scss';
import NewsPost from './NewsPost/NewsPost';
import NewsService from '@/services/newsService';
import ActionButton from '../ActionButton/ActionButton';
import SessionService from '@/services/sessionService';

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
    let canPost = false;
    try {
      canPost = await SessionService.canPostNews();
    } finally {
      return <News news={news} canPost={canPost} />;
    }
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
    <div className={styles.list}>
      <div className={styles.title}>
        <h1>Nyheter</h1>
        {canPost && <ActionButton href="/post/new">Posta nyhet</ActionButton>}
      </div>
      {news.map((newsPost) => (
        <NewsPost post={newsPost} key={newsPost.id} />
      ))}
    </div>
  );
};

const NewsError = () => {
  return (
    <div className={styles.list}>
      <h1>Nyheter</h1>
      <p>Det gick inte att hämta nyheter</p>
    </div>
  );
};

export default NewsList;
