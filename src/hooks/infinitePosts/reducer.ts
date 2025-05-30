import type { InfinitePostsAction, InfinitePostsState } from "../../types/post";
import { initialInfinitePostsState } from "./initialState";

export const infinitePostsReducer = (
  state: InfinitePostsState,
  action: InfinitePostsAction
): InfinitePostsState => {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.payload };
    case "ADD_POSTS":
      return { ...state, posts: [...state.posts, ...action.payload] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CURSOR":
      return { ...state, cursor: action.payload };
    case "SET_HAS_MORE":
      return { ...state, hasMore: action.payload };
    case "SET_LAST_CALL":
      return { ...state, lastCall: action.payload };
    case "RESET":
      return { ...initialInfinitePostsState, lastCall: Date.now() };
    default:
      return state;
  }
};
