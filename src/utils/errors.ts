import { ICustomError } from "../interfaces/ICustomError";

export const INVALID_CREDENTIALS = "InvalidCredentialsError";
export const DUPLICATE_ACCOUNT = "DuplicateAccountError";
export const INVALID_USER_DETAILS = "InvalidUserDetalisError";
export const INVALID_ARTICLE_DETAILS = "InvalidArticleDetails";
export const ARTICLE_DOES_NOT_EXISTS = "ArticleDoesNotExists";
export const NO_ARTICLES_FOUND = "NoArticlesFound";

export class CustomError extends Error implements ICustomError {
  name: string = "ServerError";
  message: string = "Something went wrong.";
  isCustomError: boolean = true;

  constructor(name: string, message: string) {
    super();
    this.name = name;
    this.message = message;
  }
}

export const InvalidCredentialsError = (): CustomError =>
  new CustomError(
    INVALID_CREDENTIALS,
    "It seems like you provided us invalid credentials. Please check your email and password."
  );

export const DuplicateAccountError = (): CustomError =>
  new CustomError(
    DUPLICATE_ACCOUNT,
    "Dear user account with provided email already exist. You can try to reset your password, in case you forgot it."
  );

export const InvalidUserDetailsError = (message: string): CustomError => new CustomError(INVALID_USER_DETAILS, message);

export const InvalidArticleDetailsError = (message: string): CustomError =>
  new CustomError(INVALID_ARTICLE_DETAILS, message);

export const ArticleDoesNotExistError = (): CustomError =>
  new CustomError(
    ARTICLE_DOES_NOT_EXISTS,
    "Your requested article is missing on our servers. You might have provided invalid details, or it was deleted for some reasons."
  );

export const NoArticlesFound = (): CustomError =>
  new CustomError(NO_ARTICLES_FOUND, "No articles found. Please create a new article to see the results.");
