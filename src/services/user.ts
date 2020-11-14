import argon2 from "argon2";
import { getRepository } from "typeorm";
import { UserEntity } from "../entities/User";
import { IUser } from "../interfaces/IUser";
import { logger } from "../tools/logger";
import { is_valid_email, is_valid_user } from "../tools/validators/user";
import { DuplicateAccountError, InvalidCredentialsError, InvalidUserDetailsError } from "../utils/errors";

export const check_user_exists = async (email: string): Promise<UserEntity | undefined> => {
  logger.debug("Checking if user exists with provided email: %s", email);
  return await getRepository(UserEntity).findOne({ email: email });
};

export const signin_user = async (email: string, password: string): Promise<UserEntity> => {
  const isValidEmail = is_valid_email(email);

  if (!isValidEmail) {
    logger.error("Provided email doesn't match valid email format: %s", email);
    throw InvalidCredentialsError();
  }

  const user = await check_user_exists(email);
  if (!user) {
    logger.error("User with provided email doesn't exist: %s", email);
    throw InvalidCredentialsError();
  }

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) {
    logger.error("User provided invalid password for email: %s", email);
    throw InvalidCredentialsError();
  }

  return user;
};

export const signup_user = async (user: UserEntity) => {
  const { error: invalidUserError, value: validUser } = is_valid_user(user);

  if (invalidUserError) {
    throw InvalidUserDetailsError(invalidUserError.message);
  }

  const userExists = await check_user_exists(user.email);
  if (userExists) {
    logger.error("User with provided email already exists for user: %o", user);
    throw DuplicateAccountError();
  }

  const hashedPassword = await argon2.hash(user.password);
  const newUser = await getRepository(UserEntity).create({
    ...(validUser as IUser),
    password: hashedPassword
  });

  return await getRepository(UserEntity).save(newUser);
};

export const reset_password = async (email: string, password: string) => {
  const isValidEmail = is_valid_email(email);

  if (!isValidEmail) {
    logger.error("Provided email doesn't match valid email format: %s", email);
    throw InvalidCredentialsError();
  }

  const user = await check_user_exists(email);
  if (!user) {
    logger.error("User with provided email doesn't exist: %s", email);
    throw InvalidCredentialsError();
  }

  user.password = await argon2.hash(password);

  await getRepository(UserEntity).save(user);
};
