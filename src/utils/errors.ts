import { ICustomError } from "../interfaces/ICustomError";

export const INVALID_CREDENTIALS = "InvalidCredentialsError";
export const DUPLICATE_ACCOUNT = "DuplicateAccountError";
export const INVALID_USER_DETAILS = "InvalidUserDetalisError";
export const INVALID_ARTICLE_DETAILS = "InvalidArticleDetails";
export const ARTICLE_DOES_NOT_EXISTS = "ArticleDoesNotExists";
export const NO_ARTICLES_FOUND = "NoArticlesFound";
export const MIDDLEWARE_ERROR = "MiddlewareError";
export const ARTICLE_ALREADY_PUBLIC = "ArticleAlreadyPublic";
export const ARTICLE_ALREADY_PUBLISHED = "ArticleAlreadyPublished";
export const USER_DOES_NOT_EXIST = "UserDoesNotExist";
export const INVALID_PASSCODE_ERROR = "InvalidOneTimePasscode";
export const EMAIL_SERVICE_ERROR = "EmailServiceError";
export const MAX_LIMIT_EXCEEDED = "MaxLimitExceeded";

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

export const NoArticlesFoundError = (): CustomError =>
  new CustomError(NO_ARTICLES_FOUND, "No articles found. Please create a new article to see the results.");

export const MiddlewareError = (message: string): CustomError => new CustomError(MIDDLEWARE_ERROR, message);

export const ArticleAlreadyPublicError = (): CustomError =>
  new CustomError(ARTICLE_ALREADY_PUBLIC, "Article is already publically available.");

export const ArticleAlreadyPublishedError = (): CustomError =>
  new CustomError(ARTICLE_ALREADY_PUBLISHED, "Article is already published.");

export const UserDoesNotExistError = (): CustomError =>
  new CustomError(USER_DOES_NOT_EXIST, "User with provided credentials doesn't exist.");

export const InvalidOneTimePasscodeError = (): CustomError =>
  new CustomError(INVALID_PASSCODE_ERROR, "Your entered an invalid One Time Passcode.");

export const EmailServiceError = (message?: string): CustomError =>
  new CustomError(EMAIL_SERVICE_ERROR, message || "Something went wrong, while sending email.");

export const MaxRetryLimitExceeded = (message?: string): CustomError =>
  new CustomError(MAX_LIMIT_EXCEEDED, message || "Please try again 5 minutes.");
