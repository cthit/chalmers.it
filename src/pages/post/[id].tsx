import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import NewsService from "@/services/newsService";

type Post = {
  title: string;
  text: string;
  postedBy: string;
};

export const getServerSideProps: GetServerSideProps<{
  post: Post;
}> = async (context) => {
  const { id } = context.query;
  const postRaw = await NewsService.getById(
    Number.parseInt(Array.isArray(id) ? id[0] : id || "0")
  );
  const post: Post =
    postRaw === null
      ? { title: "Not found", text: "Not found", postedBy: "Nobody" }
      : {
          title: postRaw.titleSv,
          text: postRaw.contentSv,
          postedBy: postRaw.writtenByCid,
        };
  return { props: { post } };
};

export default function Page({
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <title>{post.title}</title>
      <h1>{post.title}</h1>
      <h3>Inlagd av {post.postedBy}</h3>
      <p>{post.text}</p>
    </main>
  );
}
