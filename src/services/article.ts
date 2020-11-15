import { getRepository } from "typeorm";
import { ArticleEntity } from "../entities/Article";
import { IArticle } from "../interfaces/IArticle";
import { is_valid_article } from "../tools/validators/article";
import { ArticleDoesNotExistError, NoArticlesFound } from "../utils/errors";

export const check_article_exists = async (id: string): Promise<ArticleEntity | undefined> => {
  return await getRepository(ArticleEntity).findOne(id);
};

export const add_article = async (article: IArticle): Promise<ArticleEntity> => {
  const { error: invalidArticleError, value: validArticle } = is_valid_article(article);
  if (invalidArticleError) {
    throw invalidArticleError;
  }

  return await getRepository(ArticleEntity).save(validArticle as IArticle);
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

export const get_user_articles = async () => {
  const articles = await getRepository(ArticleEntity).find();
  if (!articles.length) {
    throw NoArticlesFound();
  }
  return articles;
};
