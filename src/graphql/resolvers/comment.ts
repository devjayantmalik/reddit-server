import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Arg, Ctx, Mutation, UseMiddleware } from "type-graphql";
import { check_article_exists } from "../../services/article";
import { add_new_comment } from "../../services/comment";
import { ArticleDoesNotExistError } from "../../utils/errors";
import { attachCurrentUser } from "../middlewares/attachCurrentUser";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { CommentResponse } from "../responses/CommentResponse";

export class CommentResolver {
  @Mutation(() => CommentResponse)
  @UseMiddleware(isAuthenticated, attachCurrentUser)
  async addComment(
    @Arg("comment") message: string,
    @Arg("articleId") articleId: string,
    @Ctx() { req }: ExpressContext
  ): Promise<CommentResponse> {
    try {
      const user = req.session.user!;
      const article = await check_article_exists(articleId);

      if (!article) throw ArticleDoesNotExistError();

      const comment = await add_new_comment(user, article, message);
      return { data: comment };
    } catch (err) {
      return { error: err.message };
    }
  }

  @Mutation()
  async updateComment() {}

  @Mutation()
  async deleteComment() {}
}
