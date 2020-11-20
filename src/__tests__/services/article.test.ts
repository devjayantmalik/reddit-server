import { IUser } from "../../interfaces/IUser";
import {
  add_article,
  check_article_exists,
  check_is_user_article,
  delete_article,
  get_public_articles,
  get_user_articles,
  make_article_public,
  publish_article,
  update_article
} from "../../services/article";
import { test_articles_1, test_articles_2 } from "../data/articles";
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

  it("should update article with provided details.", async () => {
    const updated = await update_article(`${test_articles_1[0].id}`, { title: "Updated Title" });

    expect(updated).toBeDefined();
    expect(updated.title).toBe("Updated Title");
  });

  it("should delete article if exists.", async () => {
    const deleted = await delete_article(`${test_articles_1[0].id}`);
    expect(deleted).toBeDefined();
    expect(deleted.title).toBe(test_articles_1[0].title);
    expect(deleted.markdown).toBe(test_articles_1[0].markdown);
  });

  it("should return user articles.", async () => {
    const articles = await get_user_articles(user_1);

    expect(articles.length).toBeDefined();
    expect(articles.length).toBeGreaterThan(0);
  });

  it("should mark article as published.", async () => {
    const published = await publish_article(`${test_articles_1[9].id}`);

    expect(published).toBeDefined();
    expect(published.isPublished).toBeTruthy();
  });

  it("should mark article as public.", async () => {
    const article = await make_article_public(`${test_articles_1[6].id}`);
    expect(article).toBeDefined();
    expect(article.isPublic).toBe(true);
  });

  it("should return public articles", async () => {
    const articles = await get_public_articles();

    expect(articles.length).toBeDefined();
    expect(articles.length).toBeGreaterThan(0);
  });
});

describe("Article Service Failure Cases", () => {
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

  it("should return undefined for non-existing article", async () => {
    const article = await check_article_exists(`${1000}`);
    expect(article).toBeUndefined();
  });

  it("should fail to add article with blank object", async () => {
    let errorOccured: boolean = false;
    try {
      await add_article({} as any, user_1);
    } catch (err) {
      errorOccured = true;
    }

    expect(errorOccured).toBeTruthy();
  });

  it("should fail to check article for unrelated article id and email.", async () => {
    let errorOccured: boolean = false;
    try {
      await check_is_user_article(user_1.email, test_articles_2[0].id as number);
    } catch (err) {
      errorOccured = true;
    }

    expect(errorOccured).toBeTruthy();
  });

  it("should fail to update for non-existing article id.", async () => {
    let errorOccured: boolean = false;
    try {
      await update_article(1000, { title: "Updated" });
    } catch (err) {
      errorOccured = true;
    }

    expect(errorOccured).toBeTruthy();
  });

  it("should fail to delete article with non-existing article id.", async () => {
    let errorOccured: boolean = false;
    try {
      await delete_article(1000);
    } catch (err) {
      errorOccured = true;
    }

    expect(errorOccured).toBeTruthy();
  });

  it("should fail to mark article published for already published articles.", async () => {
    let errorOccured: boolean = false;
    try {
      await publish_article(test_articles_1[0].id as number);
    } catch (err) {
      errorOccured = true;
    }

    expect(errorOccured).toBeTruthy();
  });

  it("should fail to mark article public for already public articles.", async () => {
    let errorOccured: boolean = false;
    try {
      await make_article_public(test_articles_1[0].id as number);
    } catch (err) {
      errorOccured = true;
    }

    expect(errorOccured).toBeTruthy();
  });

  it("should return max of 50 public articles", async () => {
    const articles = await get_public_articles();

    expect(articles.length).toBeDefined();
    expect(articles.length).toBeLessThanOrEqual(50);
  });
});
