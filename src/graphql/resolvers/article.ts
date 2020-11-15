import { Arg, Field, ID, ObjectType, Query } from "type-graphql";
import { ArticleEntity } from "../../entities/Article";

@ObjectType()
export class ArticleResponse {
  @Field({ nullable: true })
  error?: string;

  @Field(() => ArticleEntity, { nullable: true })
  data?: ArticleEntity;
}

export class ArticleResolver {
  @Query(() => ArticleResponse)
  async article(@Arg("id", () => ID) id: string): Promise<ArticleResponse> {
    try {
      console.log("id is of type: ", typeof id);
      return {};
    } catch (err) {
      return { error: err.message };
    }
  }
}
