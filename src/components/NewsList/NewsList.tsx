import { use } from 'react';
import styles from './NewsList.module.scss';
import NewsPost from './NewsPost/NewsPost';
import NewsService from '@/services/newsService';
import ActionButton from '../ActionButton/ActionButton';

const NewsList = () => {
  const news = use(NewsService.getPage(1, 10));

  return (
    <div>
      <h1>Nyheter</h1> 
      <ActionButton href="/post/new">Posta nyhet</ActionButton>
      {news.map((newsPost) => ( <NewsPost post={newsPost} key={newsPost.id} /> ))}
    </div>
  );
};

export default NewsList;
