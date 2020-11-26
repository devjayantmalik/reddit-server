import { FieldResolver, Query, Resolver, Root } from "type-graphql";
import { ArticleEntity } from "../../entities/Article";
import { UserEntity } from "../../entities/User";
import { get_user_articles } from "../../services/article";

@Resolver(UserEntity)
export class UserResolver {
  @FieldResolver(() => [ArticleEntity])
  @Query(() => [ArticleEntity])
  async articles(@Root() user: UserEntity): Promise<ArticleEntity[]> {
    return !user ? [] : await get_user_articles(user.id as Number);
  }
}
