import NewsService from "@/services/newsService";

type Post = {
  title: string;
  text: string;
  postedBy: string;
};

async function getData(postId: number) {
  const postRaw = await NewsService.getById(
    postId
  );
  return postRaw === null
      ? { title: "Not found", text: "Not found", postedBy: "Nobody" }
      : {
          title: postRaw.titleSv,
          text: postRaw.contentSv,
          postedBy: postRaw.writtenByCid,
        };
}

export default async function Page(
  { params }: { params: { id: string } },
) {
  const post = await getData(Number.parseInt(params.id));

  return (
    <main>
      <title>{post.title}</title>
      <h1>{post.title}</h1>
      <h3>Inlagd av {post.postedBy}</h3>
      <p>{post.text}</p>
    </main>
  );
}
