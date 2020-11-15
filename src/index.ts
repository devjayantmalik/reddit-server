import express from "express";
import { __port__, __prod__, __session_secret__ } from "./constants";
import { connectDb } from "./db";
import ormconfig from "./ormconfig";
import { logger } from "./tools/logger";
import cors from "cors";
import session from "express-session";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/resolvers/user";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { IUser } from "./interfaces/IUser";
import { ArticleResolver } from "./graphql/resolvers/article";

const main = async () => {
  await connectDb(ormconfig);

  const app = express();
  app.use(
    session({
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
    context: ({ req, res }): ExpressContext => ({ req, res })
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
