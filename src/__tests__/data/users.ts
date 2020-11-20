import { UserEntity } from "../../entities/User";
import { test_articles_1, test_articles_2, test_articles_3 } from "./articles";

export const test_users: UserEntity[] = [
  {
    id: 1,
    fname: "Fake",
    lname: "User",
    email: "fake@fake.com",
    password: "password@123",
    articles: test_articles_1
  },
  {
    id: 2,
    fname: "Fake",
    lname: "User",
    email: "fake1@fake.com",
    password: "password@123",
    articles: test_articles_2
  },
  {
    id: 3,
    fname: "Fake",
    lname: "User",
    email: "fake2@fake.com",
    password: "password@123",
    articles: test_articles_3
  }
];

describe("Users Data", () => {
  it("should skip", () => {
    expect(true).toBeTruthy();
  });
});
