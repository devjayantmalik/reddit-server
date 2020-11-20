import { ConnectionOptions, createConnection, getConnection, getRepository } from "typeorm";
import { ArticleEntity } from "../entities/Article";
import { UserEntity } from "../entities/User";
import { test_users } from "./data/users";

const testOrmConfig = {
  type: "mysql",
  database: "reddit_test",
  username: "test",
  password: "password",
  synchronize: true,
  dropSchema: true,
  migrationsRun: true,
  entities: [ArticleEntity, UserEntity]
} as ConnectionOptions;

export const test_connection = {
  async create() {
    await createConnection(testOrmConfig);
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    try {
      const connection = getConnection();
      await connection.synchronize(true);
    } catch (err) {
      console.log(`Sync failed with error: ${err.message}`);
    }
  },

  async insert_sample_data() {
    // Fill database with sample data.
    const users = await getRepository(UserEntity).save(test_users);

    return Promise.all(
      users.map(async (user) => {
        const articles = (user.articles || []).map((art) => {
          art.user = user;
          return art;
        }) as any;

        return getRepository(ArticleEntity).save(articles);
      })
    );
  }
};

describe("Basic Setup", () => {
  it("should skip", () => {
    expect(true).toBeTruthy();
  });
});
