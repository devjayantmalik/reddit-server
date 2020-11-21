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

export const check_article_exists = async (id: string | number): Promise<ArticleEntity | undefined> => {
  return await getRepository(ArticleEntity).findOne(id);
};

export const add_article = async (article: IArticle, user: UserEntity): Promise<ArticleEntity> => {
  const { error: invalidArticleError, value: validArticle } = is_valid_article(article);
  if (invalidArticleError) {
    throw invalidArticleError;
  }

  return await getRepository(ArticleEntity).save({ ...(validArticle as IArticle), user: user });
};

export const check_is_user_article = async (email: string, articleId: string | number): Promise<boolean> => {
  const user = await getRepository(UserEntity).findOne({ where: { email }, relations: ["articles"] });

  if (!user) throw InvalidCredentialsError();

  if (!user.articles) throw NoArticlesFoundError();

  const isUserArticle = user.articles.find((article) => article.id === parseInt(articleId as string));

  if (!isUserArticle) throw ArticleDoesNotExistError();

  return true;
};

export const update_article = async (id: string | number, article: Partial<IArticle>): Promise<ArticleEntity> => {
  const existingArticle = await check_article_exists(id);

  if (!existingArticle) {
    throw ArticleDoesNotExistError();
  }

  await getRepository(ArticleEntity).update({ id: parseInt(id as string) }, article);
  return { ...existingArticle, ...article };
};

export const delete_article = async (id: string | number): Promise<ArticleEntity> => {
  const existingArticle = await check_article_exists(id);

  if (!existingArticle) {
    throw ArticleDoesNotExistError();
  }

  await getRepository(ArticleEntity).delete({ id: parseInt(id as string) });
  return existingArticle;
};

export const get_user_articles = async (userId: string | Number) => {
  const user = await getRepository(UserEntity).findOne({ where: { id: userId }, relations: ["articles"] });

  return user?.articles || [];
};

export const publish_article = async (articleId: string | number): Promise<ArticleEntity> => {
  const existingArticle = await check_article_exists(articleId);
  if (!existingArticle) throw ArticleDoesNotExistError();

  if (existingArticle.isPublished) throw ArticleAlreadyPublishedError();

  await getRepository(ArticleEntity).update({ id: parseInt(articleId as string) }, { isPublished: true });

  return { ...existingArticle, isPublished: true };
};

export const make_article_public = async (articleId: string | number) => {
  const existingArticle = await check_article_exists(articleId);
  if (!existingArticle) throw ArticleDoesNotExistError();

  if (existingArticle.isPublic) throw ArticleAlreadyPublicError();

  await getRepository(ArticleEntity).update({ id: parseInt(articleId as string) }, { isPublic: true });

  return { ...existingArticle, isPublic: true };
};

export const get_public_articles = async (cursor?: string, limit?: number): Promise<ArticleEntity[]> => {
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
