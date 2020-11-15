import { InputType, Field } from "type-graphql";
import { IArticle } from "../../interfaces/IArticle";

@InputType()
export class ArticleInput implements IArticle {
  @Field()
  title!: string;

  @Field()
  markdown!: string;
}

@InputType()
export class ArticleUpdateInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  markdown?: string;
}
