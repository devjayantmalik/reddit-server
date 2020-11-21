import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Redis } from "ioredis";

export type IRequestContext = { redis: Redis } & ExpressContext;
