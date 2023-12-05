import style from "./NewsPost.module.scss";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";

interface ActionButtonProps {
    post: {
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
    };
}

const NewsPost: FC<ActionButtonProps> = ({ post }) => {
    return (
      <div className={style.post}>
        <h2><Link href={`/post/${post.id}`}>{post.titleSv}</Link></h2>
        <p className={style.subtitle}>Publicerad {post.createdAt.toLocaleString()} {post.divisionGroupId != null && `för ${post.divisionGroupId}`} av {post.writtenByCid}</p>
        <p>{post.contentSv}</p>
      </div>
    );
  };
  
  export default NewsPost;
  