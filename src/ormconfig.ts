import { ConnectionOptions } from "typeorm";

export default {
  type: "mysql",
  database: "reddit",
  username: "test",
  password: "password",
  synchronize: true,
  logging: true,
  entities: [__dirname + "/entities/*"]
} as ConnectionOptions;
