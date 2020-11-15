import { Field, ObjectType } from "type-graphql";
import { ArticleEntity } from "../../entities/Article";

@ObjectType()
export class ArticlesResponse {
  @Field({ nullable: true })
  error?: string;

  @Field(() => [ArticleEntity], { nullable: true })
  data?: ArticleEntity[];
}
