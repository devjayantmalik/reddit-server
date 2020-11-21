import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { REDIS_URL, __port__, __prod__, __session_secret__ } from "./constants";
import { connectDb } from "./db";
import { UserEntity } from "./entities/User";
import { ArticleResolver } from "./graphql/resolvers/article";
import { UserResolver } from "./graphql/resolvers/user";
import ormconfig from "./ormconfig";
import { logger } from "./tools/logger";
import { IRequestContext } from "./types";
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
    user?: UserEntity;
  }
}
