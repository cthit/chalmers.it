import style from './ContentArticle.module.scss';
import Divider from '@/components/Divider/Divider';
import ContentPane from '@/components/ContentPane/ContentPane';
import VerticalDivider from '@/components/VerticalDivider/VerticalDivider';

interface ContentArticleProps {
  title: string;
  subtitle?: string;
  titleSide?: React.ReactNode;
  titleLeft?: React.ReactNode;
  children: React.ReactNode;
}

const ContentArticle = (a: ContentArticleProps) => {
  return (
    <ContentPane>
      <div className={style.title}>
        {a.titleLeft && <div className={style.titleLeft}>{a.titleLeft}</div>}
        <h1>{a.title}</h1>
        {a.subtitle && (
          <>
            <VerticalDivider />
            <h3>{a.subtitle}</h3>
          </>
        )}
        <div className={style.titleRight}>{a.titleSide}</div>
      </div>
      <Divider />
      {a.children}
    </ContentPane>
  );
};

export default ContentArticle;
