import { Arg, ID, Mutation, Query, UseMiddleware } from "type-graphql";
import {
  add_article,
  check_article_exists,
  delete_article,
  get_user_articles,
  update_article
} from "../../services/article";
import { ArticleDoesNotExistError } from "../../utils/errors";
import { ArticleInput, ArticleUpdateInput } from "../inputs/ArticleInput";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { ArticleResponse } from "../responses/ArticleResponse";
import { ArticlesResponse } from "../responses/ArticlesResponse";

export class ArticleResolver {
  @UseMiddleware(isAuthenticated)
  @Query(() => ArticleResponse)
  async article(@Arg("id", () => ID) id: string): Promise<ArticleResponse> {
    try {
      const article = await check_article_exists(id);
      if (!article) throw ArticleDoesNotExistError();
      return { data: article };
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseMiddleware(isAuthenticated)
  @Query(() => ArticlesResponse)
  async articles(): Promise<ArticlesResponse> {
    try {
      const results = await get_user_articles();
      return { data: results };
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseMiddleware(isAuthenticated)
  @Mutation(() => ArticleResponse)
  async addArticle(@Arg("article") article: ArticleInput): Promise<ArticleResponse> {
    try {
      const newArticle = await add_article(article);
      return { data: newArticle };
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseMiddleware(isAuthenticated)
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

  @UseMiddleware(isAuthenticated)
  @Mutation(() => ArticleResponse)
  async deleteArticle(@Arg("id", () => ID) id: string): Promise<ArticleResponse> {
    try {
      const deletedArticle = await delete_article(id);
      return { data: deletedArticle };
    } catch (err) {
      return { error: err.message };
    }
  }
}
