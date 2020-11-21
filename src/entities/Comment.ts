import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ArticleEntity } from "./Article";
import { UserEntity } from "./User";

@ObjectType()
@Entity("comments")
export class CommentEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id?: number;

  // Many Comments can belong to one article.
  @ManyToOne(() => ArticleEntity, (art) => art.comments)
  article?: ArticleEntity;

  // Many Comments can belong to one user.
  @ManyToOne(() => UserEntity, (usr) => usr.comments)
  user?: UserEntity;

  @Field()
  @Column({ type: "text" })
  message!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date;
}
