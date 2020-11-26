import { ConnectionOptions } from "typeorm";
import { __prod__ } from "./constants";

export default {
  type: "mysql",
  database: "reddit",
  username: "test",
  password: "password",
  synchronize: true,
  logging: !__prod__,
  entities: [__dirname + "/entities/*"]
} as ConnectionOptions;
