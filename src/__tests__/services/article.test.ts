import { IUser } from "../../interfaces/IUser";
import { add_article, check_is_user_article } from "../../services/article";
import { test_users } from "../data/users";
import { test_connection } from "../setup";

const user_1 = { ...test_users[0], articles: undefined } as IUser;

describe("Article Service Success Cases", () => {
  beforeAll(async () => {
    await test_connection.create();
  });

  afterAll(async () => {
    await test_connection.close();
  });

  beforeEach(async () => {
    await test_connection.clear();
    await test_connection.insert_sample_data();
  });

  it("should add new article.", async () => {
    const addedArticle = await add_article(
      { title: "New Article that doesn't exist yet.", markdown: "Sample text for article." },
      user_1
    );

    expect(addedArticle).toBeDefined();
    expect(addedArticle.id).toBeDefined();
    expect(addedArticle.title).toBe("New Article that doesn't exist yet.");
    expect(addedArticle.markdown).toBe("Sample text for article.");
  });

  it("should check if article was created by provided email.", async () => {
    const exists = await check_is_user_article(user_1.email, (test_users[0] as any).articles[0].id);
    expect(exists).toBeTruthy();
  });

  // it("should update article with provided details.", async () => {});

  // it("should delete article if exists.", async () => {});

  // it("should return user articles.", async () => {});

  // it("should mark article as published.", async () => {});

  // it("should mark article as public.", async () => {});

  // it("should return public articles", async () => {});
});

// describe("Article Service Failure Cases", () => {
//   //   beforeAll(async () => {
//   //     await reset_db();
//   //   });

//   it("should throw error for non-existing article", async () => {});

//   it("should fail to add article with blank object", async () => {});

//   it("should fail to check article for unrelated article id and email.", async () => {});

//   it("should fail to update for non-existing article id.", async () => {});

//   it("should fail to delete article with non-existing article id.", async () => {});

//   it("should fail to mark article published for already published articles.", () => {});

//   it("should fail to mark article public for already public articles.", async () => {});

//   it("should return max of 50 public articles", async () => {});
// });
