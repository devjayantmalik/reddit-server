import { ICustomError } from "../interfaces/ICustomError";

export const INVALID_CREDENTIALS = "InvalidCredentialsError";
export const DUPLICATE_ACCOUNT = "DuplicateAccountError";
export const INVALID_USER_DETAILS = "InvalidUserDetalisError";

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
