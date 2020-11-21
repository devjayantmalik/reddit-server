import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Arg, Ctx, Mutation, Query } from "type-graphql";
import { check_user_exists, reset_password, signin_user, signup_user } from "../../services/user";
import { send_reset_password_email } from "../../tools/mailer";
import { SignupInput } from "../inputs/SignupInput";
import { AuthResponse } from "../responses/AuthResponse";
import { randomBytes } from "crypto";
import { is_valid_email } from "../../tools/validators/user";
import { InvalidOneTimePasscodeError, InvalidUserDetailsError, UserDoesNotExistError } from "../../utils/errors";
import { IRequestContext } from "../../types";
import { REDIS_FORGOT_PASSWORD_PREFIX } from "../../constants";

export class UserResolver {
  @Query(() => AuthResponse)
  async me(@Ctx() { req }: ExpressContext): Promise<AuthResponse> {
    try {
      if (!req.session.email) {
        throw new Error("You are not logged in. Please login to use our services.");
      }

      const user = await check_user_exists(req.session.email);
      return { data: user };
    } catch (err) {
      return { error: err.message };
    }
  }

  @Mutation(() => AuthResponse)
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: ExpressContext
  ): Promise<AuthResponse> {
    try {
      const user = await signin_user(email, password);

      // set login cookie for the user
      req.session.email = user.email;

      return { data: user };
    } catch (err) {
      return { error: err.message };
    }
  }

  @Mutation(() => AuthResponse)
  async signup(@Arg("user") user: SignupInput, @Ctx() { req }: ExpressContext): Promise<AuthResponse> {
    try {
      const newUser = await signup_user(user);

      // Log the user in
      req.session.email = newUser.email;

      return { data: newUser };
    } catch (err) {
      return { error: err.message };
    }
  }

  @Mutation(() => AuthResponse)
  async sendForgotPasswordEmail(@Arg("email") email: string, @Ctx() { redis }: IRequestContext): Promise<AuthResponse> {
    try {
      if (!is_valid_email(email)) throw InvalidUserDetailsError("Invalid Email provided.");

      const user = await check_user_exists(email);
      if (!user) throw UserDoesNotExistError();

      const code: string = randomBytes(5).toString("hex").toUpperCase();
      await send_reset_password_email(code, email);

      // Store the passcode in redis.
      await redis.set(`${REDIS_FORGOT_PASSWORD_PREFIX}${code}`, email);

      return {};
    } catch (err) {
      return { error: err.message };
    }
  }

  @Mutation(() => AuthResponse)
  async verifyForgotPasswordCode(
    @Arg("code") code: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis }: IRequestContext
  ): Promise<AuthResponse> {
    try {
      const email = await redis.get(`${REDIS_FORGOT_PASSWORD_PREFIX}${code}`);
      if (!email || !is_valid_email(email)) throw InvalidOneTimePasscodeError();

      await reset_password(email, newPassword);

      return {};
    } catch (err) {
      return { error: err.message };
    }
  }
}
