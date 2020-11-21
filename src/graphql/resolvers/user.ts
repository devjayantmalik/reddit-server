import { Query, Root } from "type-graphql";
import { ArticleEntity } from "../../entities/Article";
import { UserEntity } from "../../entities/User";
import { get_user_articles } from "../../services/article";

export class UserResolver {
  @Query(() => [ArticleEntity])
  async articles(@Root() user: UserEntity): Promise<ArticleEntity[]> {
    return !user ? [] : await get_user_articles(user.id as Number);
  }
}
