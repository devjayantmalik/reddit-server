import { getRepository } from "typeorm";
import { ArticleEntity } from "../entities/Article";
import { CommentEntity } from "../entities/Comment";

export const get_comments_by_article = async (articleId: string | Number): Promise<CommentEntity[]> => {
  const user = await getRepository(ArticleEntity).findOne({
    where: { id: Number(articleId) },
    relations: ["comments"]
  });

  return user?.comments || [];
};
