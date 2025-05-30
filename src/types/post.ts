export interface Post {
  id: string;
  name: string;
  tagline: string;
  description: string;
  votesCount: number;
  thumbnail: {
    url: string;
  };
  media: {
    url: string;
    type: string; 
  }[];
  makers: {
    id: string;
    name: string;
    username: string;
    profileImage: string;
  }[];
  slug: string;
  website?: string;
}

export interface CachedPosts {
  posts: Post[];
  timestamp: number;
}

export type InfinitePostsState = {
  posts: Post[];
  loading: boolean;
  cursor?: string;
  hasMore: boolean;
  lastCall: number;
};

export type InfinitePostsAction =
  | { type: "SET_POSTS"; payload: Post[] }
  | { type: "ADD_POSTS"; payload: Post[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CURSOR"; payload?: string }
  | { type: "SET_HAS_MORE"; payload: boolean }
  | { type: "SET_LAST_CALL"; payload: number }
  | { type: "RESET" };