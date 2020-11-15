import { getRepository } from "typeorm";
import { ArticleEntity } from "../entities/Article";
import { UserEntity } from "../entities/User";
import { IArticle } from "../interfaces/IArticle";
import { is_valid_article } from "../tools/validators/article";
import { ArticleDoesNotExistError, NoArticlesFound } from "../utils/errors";

export const check_article_exists = async (id: string): Promise<ArticleEntity | undefined> => {
  return await getRepository(ArticleEntity).findOne(id);
};

// TODO: Add the user and article association.
export const add_article = async (article: IArticle, user: UserEntity): Promise<ArticleEntity> => {
  const { error: invalidArticleError, value: validArticle } = is_valid_article(article);
  if (invalidArticleError) {
    throw invalidArticleError;
  }

  return await getRepository(ArticleEntity).save(validArticle as IArticle);
};

// TODO: Make sure to implement this function. It checks if the article belongs to a user with provided email.
export const check_is_user_article = async (email: string, articleId): Promise<boolean> => {
  throw new Error("check is user article not implemented yet.");
};

export const update_article = async (id: string, article: Partial<IArticle>): Promise<ArticleEntity> => {
  const existingArticle = await check_article_exists(id);

  if (!existingArticle) {
    throw ArticleDoesNotExistError();
  }

  await getRepository(ArticleEntity).update({ id: parseInt(id) }, article);
  return { ...existingArticle, ...article };
};

export const delete_article = async (id: string): Promise<ArticleEntity> => {
  const existingArticle = await check_article_exists(id);

  if (!existingArticle) {
    throw ArticleDoesNotExistError();
  }

  await getRepository(ArticleEntity).delete({ id: parseInt(id) });
  return existingArticle;
};

export const get_user_articles = async (user: UserEntity) => {
  const articles = await getRepository(ArticleEntity).find({ where: { user } });
  if (!articles.length) {
    throw NoArticlesFound();
  }
  return articles;
};
