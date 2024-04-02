import ContentPane from '@/components/ContentPane/ContentPane';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import GammaService from '@/services/gammaService';
import NewsService from '@/services/newsService';

type Post = {
  title: string;
  text: string;
  postedBy: string;
};

async function getData(postId: number): Promise<Post> {
  const postRaw = await NewsService.get(postId);
  return postRaw === null
    ? { title: 'Not found', text: 'Not found', postedBy: 'Nobody' }
    : {
        title: postRaw.titleSv,
        text: postRaw.contentSv,
        postedBy:
          (await GammaService.getNick(postRaw.writtenByGammaUserId)) ||
          'Okänd användare'
      };
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getData(Number.parseInt(params.id));

  return (
    <main>
      <title>{post.title}</title>
      <ThreePaneLayout
        middle={
          <ContentPane>
            <h1>{post.title}</h1>
            <h3>Inlagd av {post.postedBy}</h3>
            <MarkdownView content={post.text} />
          </ContentPane>
        }
      />
    </main>
  );
}
