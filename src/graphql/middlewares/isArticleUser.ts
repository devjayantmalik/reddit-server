import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { MiddlewareFn } from "type-graphql";
import { IMiddlewareError } from "../../interfaces/IMiddlewareError";
import { check_is_user_article } from "../../services/article";
import { InvalidCredentialsError, MiddlewareError } from "../../utils/errors";

/**
 * Returns Error if args.id is not the original user of article.
 * Caution: Only use with routes that receive "id" as arguments
 */
export const isArticleUser: MiddlewareFn = async ({ args, context }, next): Promise<IMiddlewareError> => {
  try {
    if (!args.id) {
      throw MiddlewareError(
        "Please provide id as argument to middleware for successful working. Dear user, this is fault on our side, please make sure to report us, so we can fix it soon. Please include screenshot of the error and description of the error in the issue. This is helpful for us. Thanks, and it's an opportunity to work with us and strengthen the community."
      );
    }

    const { req } = context as ExpressContext;

    const isValid = await check_is_user_article(req.session.email as string, args.id);

    if (!isValid)
      throw InvalidCredentialsError(
        "You are not the owner of this article, so we can't allow you access to this article."
      );

    return next();
  } catch (err) {
    return { error: err.message };
  }
};
