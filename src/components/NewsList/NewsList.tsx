import styles from './NewsList.module.scss';
import NewsPost from './NewsPost/NewsPost';
import NewsService from '@/services/newsService';
import ActionButton from '../ActionButton/ActionButton';

interface NewsPost {
  id: number;
  titleSv: string;
  titleEn: string;
  contentSv: string;
  contentEn: string;
  writtenByCid: string;
  createdAt: Date;
  updatedAt: Date;
  divisionGroupId: number | null;
  mediaSha256: string | null;
}

const NewsList = async () => {
  try {
    const news = await NewsService.getPage(1, 10);
    return <News news={news} />;
  } catch {
    return <NewsError />;
  }
};

const News = ({ news }: { news: NewsPost[] }) => {
  return (
    <div className={styles.list}>
      <div className={styles.title}>
        <h1>Nyheter</h1>
        <ActionButton href="/post/new">Posta nyhet</ActionButton>
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
