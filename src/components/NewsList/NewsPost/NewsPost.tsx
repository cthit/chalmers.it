import Divider from "@/components/Divider/Divider";
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
      <>
        <Divider />
        <div>
          <h2 className={style.title} ><Link href={`/post/${post.id}`}>{post.titleSv}</Link></h2>
          <p className={style.subtitle}>{post.createdAt.toLocaleString()} | Skriven {post.divisionGroupId != null && `för ${post.divisionGroupId}`} av {post.writtenByCid}</p>
          <p>{post.contentSv}</p>
        </div>
      </>
      
    );
  };
  
  export default NewsPost;
  