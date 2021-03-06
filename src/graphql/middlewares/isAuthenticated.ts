import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { MiddlewareFn } from "type-graphql";
import { InvalidCredentialsError } from "../../utils/errors";
import { IMiddlewareError } from "../../interfaces/IMiddlewareError";

export const isAuthenticated: MiddlewareFn = async ({ context }, next): Promise<IMiddlewareError> => {
  try {
    const { req } = context as ExpressContext;
    if (!req.session.email) {
      throw InvalidCredentialsError();
    }
    return next();
  } catch (err) {
    return { error: err.message };
  }
};
