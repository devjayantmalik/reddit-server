import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { UserEntity } from "./User";

@ObjectType()
@Entity("articles")
export class ArticleEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id?: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column({ type: "text" })
  markdown!: string;

  @ManyToOne(() => UserEntity, (usr) => usr.articles, { cascade: true })
  user?: UserEntity;

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date;
}
