import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Arg, Ctx, Mutation, Query } from "type-graphql";
import { check_user_exists, reset_password, signin_user, signup_user } from "../../services/user";
import { send_reset_password_email } from "../../tools/mailer";
import { SignupInput } from "../inputs/SignupInput";
import { AuthResponse } from "../responses/AuthResponse";
import { randomBytes } from "crypto";
import { is_valid_email } from "../../tools/validators/user";
import { InvalidUserDetailsError, INVALID_USER_DETAILS } from "../../utils/errors";

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

  // TODO: Send user authentication token before changing the password,
  // But for development purposes, it is okay for some time, till we
  // implement the functionality.
  @Mutation(() => AuthResponse)
  async sendForgotPasswordEmail(
    @Arg("email") email: string,
    @Arg("newPassword") newPassword: string
    // @Ctx() { req, res }: ExpressContext
  ): Promise<AuthResponse> {
    try {
      if (!is_valid_email(email)) throw InvalidUserDetailsError("Invalid Email provided.");

      const code: string = randomBytes(5).toString("hex").toUpperCase();
      const response = send_reset_password_email(code, email);

      // TODO: Store the passcode somewhere in session.

      await reset_password(email, newPassword);
    } catch (err) {
      return { error: err.message };
    }
  }

  @Mutation(() => AuthResponse)
  async verifyForgotPasswordCode(): // @Arg("code") code: string,
  // @Ctx() { req, res }: ExpressContext
  Promise<AuthResponse> {
    try {
      // TODO: Reset the Password for the user.

      // await reset_password(email, newPassword);

      // TODO: Return user instead of undefined.
      return { data: undefined };
    } catch (err) {
      return { error: err.message };
    }
  }
}
