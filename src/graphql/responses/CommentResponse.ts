import { Field, ObjectType } from "type-graphql";
import { CommentEntity } from "../../entities/Comment";

@ObjectType()
export class CommentResponse {
  @Field({ nullable: true })
  error?: string;

  @Field(() => CommentEntity, { nullable: true })
  data?: CommentEntity;
}
