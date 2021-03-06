import { Field, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ArticleEntity } from "./Article";
import { CommentEntity } from "./Comment";

@ObjectType()
@Entity("users")
export class UserEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id?: number;

  @Field()
  @Column()
  fname!: string;

  @Field()
  @Column()
  lname!: string;

  @Field()
  @Column()
  email!: string;

  @Column({ type: "text" })
  password!: string;

  // One User can have many articles.
  @OneToMany(() => ArticleEntity, (art) => art.user)
  articles?: ArticleEntity[];

  // One user can have many comments
  @OneToMany(() => CommentEntity, (cmt) => cmt.user)
  comments?: CommentEntity[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date;
}
