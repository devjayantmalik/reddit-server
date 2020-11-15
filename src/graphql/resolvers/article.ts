import { Arg, Field, ID, Mutation, ObjectType, Query } from "type-graphql";
import { ArticleEntity } from "../../entities/Article";
import {
  add_article,
  check_article_exists,
  delete_article,
  get_user_articles,
  update_article
} from "../../services/article";
import { ArticleDoesNotExistError } from "../../utils/errors";
import { ArticleInput, ArticleUpdateInput } from "../inputs/ArticleInput";

@ObjectType()
export class ArticleResponse {
  @Field({ nullable: true })
  error?: string;

  @Field(() => ArticleEntity, { nullable: true })
  data?: ArticleEntity;
}

@ObjectType()
export class ArticlesResponse {
  @Field({ nullable: true })
  error?: string;

  @Field(() => [ArticleEntity], { nullable: true })
  data?: ArticleEntity[];
}

export class ArticleResolver {
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

  @Query(() => ArticlesResponse)
  async articles(): Promise<ArticlesResponse> {
    try {
      const results = await get_user_articles();
      return { data: results };
    } catch (err) {
      return { error: err.message };
    }
  }

  @Mutation(() => ArticleResponse)
  async addArticle(@Arg("article") article: ArticleInput): Promise<ArticleResponse> {
    try {
      const newArticle = await add_article(article);
      return { data: newArticle };
    } catch (err) {
      return { error: err.message };
    }
  }

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
