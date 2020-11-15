import { InputType, Field } from "type-graphql";
import { IUser } from "../../interfaces/IUser";

@InputType()
export class SignupInput implements IUser {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  fname!: string;

  @Field()
  lname!: string;
}
