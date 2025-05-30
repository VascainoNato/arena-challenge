import type { InfinitePostsState } from "../../types/post";

export const initialInfinitePostsState: InfinitePostsState = {
  posts: [],
  loading: false,
  cursor: undefined,
  hasMore: true,
  lastCall: Date.now(),
};
