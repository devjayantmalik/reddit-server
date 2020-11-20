import {
  ArticleAlreadyPublicError,
  ArticleAlreadyPublishedError,
  ArticleDoesNotExistError,
  NoArticlesFoundError,
  InvalidArticleDetailsError,
  ARTICLE_ALREADY_PUBLIC,
  ARTICLE_ALREADY_PUBLISHED,
  ARTICLE_DOES_NOT_EXISTS,
  NO_ARTICLES_FOUND,
  InvalidUserDetailsError,
  InvalidCredentialsError,
  DuplicateAccountError,
  MiddlewareError,
  INVALID_CREDENTIALS,
  DUPLICATE_ACCOUNT,
  INVALID_USER_DETAILS,
  MIDDLEWARE_ERROR,
  INVALID_ARTICLE_DETAILS
} from "../../utils/errors";

describe("Custom Article Errors", () => {
  test("Article is already marked public error.", () => {
    const err = ArticleAlreadyPublicError();
    expect(err.name).toEqual(ARTICLE_ALREADY_PUBLIC);
    expect(err.isCustomError).toBeTruthy();
  });

  test("Article is already marked published error.", () => {
    const err = ArticleAlreadyPublishedError();
    expect(err.name).toEqual(ARTICLE_ALREADY_PUBLISHED);
    expect(err.isCustomError).toBeTruthy();
  });
  test("Article does not exist error.", () => {
    const err = ArticleDoesNotExistError();
    expect(err.name).toEqual(ARTICLE_DOES_NOT_EXISTS);
    expect(err.isCustomError).toBeTruthy();
  });
  test("No articles found error.", () => {
    const err = NoArticlesFoundError();
    expect(err.name).toEqual(NO_ARTICLES_FOUND);
    expect(err.isCustomError).toBeTruthy();
  });
  test("Invalid article details provided error.", () => {
    const err = InvalidArticleDetailsError("Invalid email provided.");
    expect(err.name).toEqual(INVALID_ARTICLE_DETAILS);
    expect(err.isCustomError).toBeTruthy();
    expect(err.message).toBe("Invalid email provided.");
  });
});

describe("Custom Auth Errors", () => {
  test("Invalid Credentials provided error.", () => {
    const err = InvalidCredentialsError();
    expect(err.name).toEqual(INVALID_CREDENTIALS);
    expect(err.isCustomError).toBeTruthy();
  });

  test("User already exists error.", () => {
    const err = DuplicateAccountError();
    expect(err.name).toEqual(DUPLICATE_ACCOUNT);
    expect(err.isCustomError).toBeTruthy();
  });
  test("Article does not exist error.", () => {
    const err = ArticleDoesNotExistError();
    expect(err.name).toEqual(ARTICLE_DOES_NOT_EXISTS);
    expect(err.isCustomError).toBeTruthy();
  });
  test("Invalid User details error.", () => {
    const err = InvalidUserDetailsError("Email is missing");
    expect(err.name).toEqual(INVALID_USER_DETAILS);
    expect(err.isCustomError).toBeTruthy();
    expect(err.message).toBe("Email is missing");
  });
});

describe("Graphql Middleware Error", () => {
  test("Middleware Error", () => {
    const err = MiddlewareError("Your account is blocked.");
    expect(err.name).toEqual(MIDDLEWARE_ERROR);
    expect(err.isCustomError).toBeTruthy();
    expect(err.message).toBe("Your account is blocked.");
  });
});
