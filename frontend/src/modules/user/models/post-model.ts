import type { Comment } from './comment-model';

export interface Post {
  readonly comments: Comment[];
  readonly username: string;
  readonly authorFirstName: string;
  readonly authorId: string;
  readonly authorLastName: string;
  readonly content: string;
  readonly createdAt: string;
  readonly links: string[];
  readonly postId: string;
  readonly title: string;
  readonly updatedAt: string;
}
