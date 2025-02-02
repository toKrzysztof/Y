export interface Post {
  readonly id: string;
  readonly parentPostId: string;
  readonly replies?: Post[];
  readonly authorUsername: string;
  readonly parentPostAuthorUsername: string;
  readonly authorName: string;
  readonly content: string;
  readonly createdAt: string;
  readonly links: string[];
  readonly postId: string;
}
