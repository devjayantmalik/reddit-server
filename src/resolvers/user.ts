import { Query } from "type-graphql";

export class UserResolver {
  @Query(() => Boolean)
  async me(): Promise<boolean> {
    return false;
  }
}
