import { getRepository } from "typeorm";
import { ArticleEntity } from "../entities/Article";
import { CommentEntity } from "../entities/Comment";
import { UserEntity } from "../entities/User";
import { is_valid_comment } from "../tools/validators/comment";

export const get_article_comments = async (articleId: string | Number): Promise<CommentEntity[]> => {
  const user = await getRepository(ArticleEntity).findOne({
    where: { id: Number(articleId) },
    relations: ["comments"]
  });

  return user?.comments || [];
};

export const add_new_comment = async (user: UserEntity, article: ArticleEntity, message: string) => {
  const { error, value } = is_valid_comment(message);
  if (error) throw error;

  return await getRepository(CommentEntity).save({
    article: article,
    user: user,
    message: value
  });
};
