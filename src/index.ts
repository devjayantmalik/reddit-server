import express from "express";
import { __port__, __prod__, __session_secret__ } from "./constants";
import { connectDb } from "./db";
import ormconfig from "./ormconfig";
import { logger } from "./tools/logger";
import cors from "cors";
import session from "express-session";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

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
  app.use(cors({ origin: "*", credentials: true }));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false
    }),
    context: ({ req, res }): ExpressContext => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(__port__, () => {
    logger.info("=====================================================");
    logger.info(`🛡 Server started at: http://localhost:${__port__} 🛡`);
    logger.info("=====================================================");
  });
};

main().catch((err) => {
  console.error(err);
  logger.error("🔥 Main Process Error Occured: %o", err);
  process.exit(1);
});
