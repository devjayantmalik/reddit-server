import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Arg, Ctx, Mutation, Query } from "type-graphql";
import { check_user_exists, reset_password, signin_user, signup_user } from "../../services/user";
import { SignupInput } from "../inputs/SignupInput";
import { AuthResponse } from "../responses/AuthResponse";

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
  async forgot_password(
    @Arg("email") email: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req, res }: ExpressContext
  ): Promise<AuthResponse> {
    try {
      await reset_password(email, newPassword);
      // destory the session for the current user.
      req.session.destroy((err) => {
        if (err) throw err;
      });
      res.clearCookie("qid");
      return { data: undefined };
    } catch (err) {
      return { error: err.message };
    }
  }
}
