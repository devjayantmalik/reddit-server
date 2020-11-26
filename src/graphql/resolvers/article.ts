import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { ArticleEntity } from "../../entities/Article";
import { CommentEntity } from "../../entities/Comment";
import {
  add_article,
  check_article_exists,
  delete_article,
  get_public_articles,
  make_article_public,
  publish_article,
  update_article
} from "../../services/article";
// import { check_user_exists } from "../../services/auth";
import { get_article_comments } from "../../services/comment";
import { ArticleDoesNotExistError, InvalidCredentialsError } from "../../utils/errors";
import { ArticleInput, ArticleUpdateInput } from "../inputs/ArticleInput";
import { attachCurrentUser } from "../middlewares/attachCurrentUser";
import { isArticleUser } from "../middlewares/isArticleUser";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { ArticleResponse } from "../responses/ArticleResponse";
import { ArticlesResponse } from "../responses/ArticlesResponse";

@Resolver(ArticleEntity)
export class ArticleResolver {
  @FieldResolver(() => [CommentEntity])
  @Query(() => [CommentEntity])
  async comments(@Root() art: ArticleEntity): Promise<CommentEntity[]> {
    const results = await get_article_comments(art.id as Number);
    return results;
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
