import { Field, ObjectType } from "type-graphql";
import { ArticleEntity } from "../../entities/Article";

@ObjectType()
export class ArticleResponse {
  @Field({ nullable: true })
  error?: string;

  @Field(() => ArticleEntity, { nullable: true })
  data?: ArticleEntity;
}
