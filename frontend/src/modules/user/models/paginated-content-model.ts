export interface PaginatedContent<T> {
  readonly content: T[];
  readonly count: number;
}
