import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import session from "express-session";
import { buildSchema } from "type-graphql";
import { REDIS_URL, __port__, __prod__, __session_secret__ } from "./constants";
import { connectDb } from "./db";
import { ArticleResolver } from "./graphql/resolvers/article";
import { UserResolver } from "./graphql/resolvers/user";
import { IUser } from "./interfaces/IUser";
import ormconfig from "./ormconfig";
import { logger } from "./tools/logger";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { IRequestContext } from "./types";
import { IIPInfo, ip_middleware } from "./tools/ipfinder";
const main = async () => {
  await connectDb(ormconfig);

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = new Redis(REDIS_URL);

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: __session_secret__,
      saveUninitialized: false,
      resave: false,
      name: "qid",
      cookie: {
        httpOnly: true, // You can't access Cookie via Console
        secure: __prod__,
        sameSite: "lax",
        signed: true
      }
    })
  );
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(ip_middleware);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ArticleResolver],
      validate: false
    }),
    context: ({ req, res }): IRequestContext => ({ req, res, redis: redisClient })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(__port__, () => {
    console.log("=====================================================");
    console.log(`🛡 Server started at: http://localhost:${__port__} 🛡`);
    console.log("=====================================================");
  });
};

main().catch((err) => {
  console.error(err);
  logger.error("🔥 Main Process Error Occured: %o", err);
  process.exit(1);
});

// Use this to add fields to express session object.
// and to get auto completion.
declare module "express-session" {
  export interface Session {
    email?: string;
    user?: IUser;
  }
}

declare global {
  namespace Express {
    interface Request {
      ip_address?: IIPInfo;
    }
  }
}
