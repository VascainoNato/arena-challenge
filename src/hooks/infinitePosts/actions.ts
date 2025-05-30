import type { InfinitePostsAction, Post } from "../../types/post";

export const setPosts = (posts: Post[]): InfinitePostsAction => ({
  type: "SET_POSTS",
  payload: posts,
});

export const addPosts = (posts: Post[]): InfinitePostsAction => ({
  type: "ADD_POSTS",
  payload: posts,
});

export const setLoading = (loading: boolean): InfinitePostsAction => ({
  type: "SET_LOADING",
  payload: loading,
});

export const setCursor = (cursor?: string): InfinitePostsAction => ({
  type: "SET_CURSOR",
  payload: cursor,
});

export const setHasMore = (hasMore: boolean): InfinitePostsAction => ({
  type: "SET_HAS_MORE",
  payload: hasMore,
});

export const setLastCall = (timestamp: number): InfinitePostsAction => ({
  type: "SET_LAST_CALL",
  payload: timestamp,
});

export const resetState = (): InfinitePostsAction => ({
  type: "RESET",
});
