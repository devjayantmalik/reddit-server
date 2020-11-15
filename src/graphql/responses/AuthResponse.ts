import { ObjectType, Field } from "type-graphql";
import { UserEntity } from "../../entities/User";

@ObjectType()
export class AuthResponse {
  @Field({ nullable: true })
  error?: string;

  @Field({ nullable: true })
  data?: UserEntity;
}
