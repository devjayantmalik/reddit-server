import { getRepository } from "typeorm";
import { ArticleEntity } from "../entities/Article";
import { UserEntity } from "../entities/User";
import { IArticle } from "../interfaces/IArticle";
import { is_valid_article } from "../tools/validators/article";
import {
  ArticleAlreadyPublicError,
  ArticleAlreadyPublishedError,
  ArticleDoesNotExistError,
  InvalidCredentialsError,
  NoArticlesFoundError
} from "../utils/errors";

export const check_article_exists = async (id: string): Promise<ArticleEntity | undefined> => {
  return await getRepository(ArticleEntity).findOne(id);
};

// TODO: Add the user and article association.
export const add_article = async (article: IArticle, user: UserEntity): Promise<ArticleEntity> => {
  const { error: invalidArticleError, value: validArticle } = is_valid_article(article);
  if (invalidArticleError) {
    throw invalidArticleError;
  }

  return await getRepository(ArticleEntity).save({ ...(validArticle as IArticle), user: user });
};

// TODO: Make sure to implement this function. It checks if the article belongs to a user with provided email.
export const check_is_user_article = async (email: string, articleId: string): Promise<boolean> => {
  const user = await getRepository(UserEntity).findOne({ where: { email }, relations: ["articles"] });

  if (!user) throw InvalidCredentialsError();

  if (!user.articles) throw NoArticlesFoundError();

  const isUserArticle = user.articles.find((article) => article.id === parseInt(articleId));

  if (!isUserArticle) throw ArticleDoesNotExistError();

  return true;
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
    throw NoArticlesFoundError();
  }
  return articles;
};

export const publish_article = async (articleId: string): Promise<ArticleEntity> => {
  const existingArticle = await check_article_exists(articleId);
  if (!existingArticle) throw ArticleDoesNotExistError();

  if (existingArticle.isPublished) throw ArticleAlreadyPublishedError();

  await getRepository(ArticleEntity).update({ id: parseInt(articleId) }, { isPublished: true });

  return { ...existingArticle, isPublished: true };
};

export const make_article_public = async (articleId: string) => {
  const existingArticle = await check_article_exists(articleId);
  if (!existingArticle) throw ArticleDoesNotExistError();

  if (existingArticle.isPublic) throw ArticleAlreadyPublicError();

  await getRepository(ArticleEntity).update({ id: parseInt(articleId) }, { isPublic: true });

  return { ...existingArticle, isPublic: true };
};

export const get_public_articles = async (cursor: string, limit: number): Promise<ArticleEntity[]> => {
  limit = Math.min(50, Number(limit)) || 50;
  const results = await getRepository(ArticleEntity)
    .createQueryBuilder()
    .where(
      `${cursor ? "createdAt <= :cursor and isPublic = 1 and isPublished = 1" : "isPublic = 1 and isPublished = 1"}`,
      cursor ? { cursor: new Date(Number(cursor)) } : {}
    )
    .addOrderBy("createdAt", "DESC")
    .take(limit)
    .getMany();
  return results;
};
