import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { ArticleEntity } from "../../entities/Article";
import { CommentEntity } from "../../entities/Comment";
import {
  add_article,
  check_article_exists,
  delete_article,
  get_public_articles,
  get_user_articles,
  make_article_public,
  publish_article,
  update_article
} from "../../services/article";
import { get_comments_by_article } from "../../services/comment";
import { check_user_exists } from "../../services/user";
import { ArticleDoesNotExistError, InvalidCredentialsError } from "../../utils/errors";
import { ArticleInput, ArticleUpdateInput } from "../inputs/ArticleInput";
import { attachCurrentUser } from "../middlewares/attachCurrentUser";
import { isArticleUser } from "../middlewares/isArticleUser";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { ArticleResponse } from "../responses/ArticleResponse";
import { ArticlesResponse } from "../responses/ArticlesResponse";

/**
 * Route: /article : Returns a specific article with provided id. Supports both authenticated user and public article.
 * Route: /userArticles: Returns articles for logged in user.
 * Route: /publicArticles: Returns articles for logged in user.
 * Route: /addArticle: Adds a new article (Authentication Required)
 * Route: /updateArticle: Updates an existing article (Authentication Required)
 * Route: /deleteArticle: Deletes an article (Authentication Required)
 */

@Resolver(ArticleEntity)
export class ArticleResolver {
  @FieldResolver(() => [CommentEntity])
  @Query(() => [CommentEntity])
  async comments(@Root() art: ArticleEntity): Promise<CommentEntity[]> {
    return await get_comments_by_article(art.id as Number);
  }
  @Query(() => ArticleResponse)
  async article(@Arg("id", () => ID) id: string, @Ctx() { req }: ExpressContext): Promise<ArticleResponse> {
    try {
      const article = await check_article_exists(id);
      if (!article) throw ArticleDoesNotExistError();

      if (article.isPublic && article.isPublished) {
        return { data: article };
      }

      if (!req.session.email) {
        throw InvalidCredentialsError();
      }
      const user = await check_user_exists(req.session.email);
      if (!user) throw InvalidCredentialsError();

      return { data: article };
    } catch (err) {
      return { error: err.message };
    }
  }

  @Query(() => ArticlesResponse)
  async publicArticles(
    @Arg("cursor", { nullable: true }) cursor: string,
    @Arg("limit", () => Int, { nullable: true }) limit: number
  ): Promise<ArticlesResponse> {
    try {
      const articles = await get_public_articles(cursor, limit);
      return { data: articles };
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseMiddleware(isAuthenticated, attachCurrentUser)
  @Query(() => ArticlesResponse)
  async userArticles(@Ctx() { req }: ExpressContext): Promise<ArticlesResponse> {
    try {
      const results = await get_user_articles((req as any).session.user.id as Number);
      return { data: results };
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseMiddleware(isAuthenticated, attachCurrentUser)
  @Mutation(() => ArticleResponse)
  async addArticle(@Arg("article") article: ArticleInput, @Ctx() { req }: ExpressContext): Promise<ArticleResponse> {
    try {
      const newArticle = await add_article(article, req.session.user!);
      return { data: newArticle };
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseMiddleware(isAuthenticated, isArticleUser)
  @Mutation(() => ArticleResponse)
  async updateArticle(
    @Arg("id", () => ID) id: string,
    @Arg("article") article: ArticleUpdateInput
  ): Promise<ArticleResponse> {
    try {
      const updatedArticle = await update_article(id, article);
      return { data: updatedArticle };
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseMiddleware(isAuthenticated, isArticleUser)
  @Mutation(() => ArticleResponse)
  async deleteArticle(@Arg("id", () => ID) id: string): Promise<ArticleResponse> {
    try {
      const deletedArticle = await delete_article(id);
      return { data: deletedArticle };
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseMiddleware(isAuthenticated, isArticleUser)
  @Mutation(() => ArticleResponse)
  async publishArticle(@Arg("id", () => ID) id: string): Promise<ArticleResponse> {
    try {
      const article = await publish_article(id);
      return { data: article };
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseMiddleware(isAuthenticated, isArticleUser)
  @Mutation(() => ArticleResponse)
  async markArticlePublic(@Arg("id", () => ID) id: string): Promise<ArticleResponse> {
    try {
      const article = await make_article_public(id);
      return { data: article };
    } catch (err) {
      return { error: err.message };
    }
  }
}
