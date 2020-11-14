import { Connection, ConnectionOptions, createConnection } from "typeorm";

let __connection: Connection;
export const connectDb = async (
  opts: ConnectionOptions
): Promise<Connection> => {
  __connection = await createConnection({ ...opts, entities: [] });
  return __connection;
};

export const isConnected = (): boolean => {
  return typeof __connection !== "undefined";
};

export const getConnection = (): Connection | undefined => {
  return __connection;
};
