import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CommentEntity } from "./Comment";
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

  // Many articles can belong to one user.
  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (usr) => usr.articles, { cascade: true })
  user?: UserEntity;

  // One article could have many comments.
  @Field(() => [CommentEntity])
  @OneToMany(() => CommentEntity, (cmt) => cmt.article, { cascade: true })
  comments?: CommentEntity[];

  @Field()
  @Column({ default: false })
  isPublic?: boolean;

  @Field()
  @Column({ default: false })
  isPublished?: boolean;

  @Field()
  @Column({ type: "int", default: 0 })
  likes?: number;

  @Field()
  @Column({ type: "int", default: 0 })
  dislikes?: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date;
}

// User, Article, Comment
// One user can have multiple articles (OneToMany) ✔
// Many article belongs to one user (ManyToOne) ✔
// One Article can have multiple comments (OneToMany) ✔
// Many comments belongs to one user (ManyToOne) ✔
// One user can have multiple comments. (OneToMany)
// Many comments belongs to one user. (ManyToOne)
