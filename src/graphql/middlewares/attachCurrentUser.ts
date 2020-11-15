import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { MiddlewareFn } from "type-graphql";
import { check_user_exists } from "../../services/user";
import { InvalidCredentialsError } from "../../utils/errors";
import { IMiddlewareError } from "../../interfaces/IMiddlewareError";

export const attachCurrentUser: MiddlewareFn = async ({ context }, next): Promise<IMiddlewareError> => {
  try {
    const { req } = context as ExpressContext;

    // Email property exists because of isAuthenticated middleware.
    const user = await check_user_exists(req.session.email as string);
    if (!user) throw InvalidCredentialsError();

    req.session.user = user;
    return next();
  } catch (err) {
    return { error: err.message };
  }
};
