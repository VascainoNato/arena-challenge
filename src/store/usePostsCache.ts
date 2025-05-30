import { create } from 'zustand';
import type { CachedPosts, Post } from '../types/post';

type TabType = 'RANKING' | 'NEWEST';

// Stores the cache for each tab (RANKING and NEWEST) individually.
interface PostsCacheState {
  postsByTab: Record<TabType, CachedPosts | undefined>;
  setPostsForTab: (tab: TabType, posts: Post[]) => void;
  getPostsForTab: (tab: TabType) => Post[] | null;
  isCacheValid: (tab: TabType) => boolean;
  updateSinglePost: (tab: TabType, updatedPost: Post) => void;
}

// 3 minutes of cache.
const CACHE_TTL = 180 * 1000; 

// Create the store with Zustand, with set and get methods to manipulate the state.
export const usePostsCache = create<PostsCacheState>((set, get) => ({
  // Initializes empty cache for each tab
  postsByTab: {
      RANKING: undefined,
      NEWEST: undefined
  },

  // Saves a new array of posts in the cache for the given tab, recording the current time as a timestamp.
  setPostsForTab: (tab, posts) => {
    set((state) => ({
      postsByTab: {
        ...state.postsByTab,
        [tab]: { posts, timestamp: Date.now() },
      },
    }));
  },

  // Checks if there is a valid cache for that tab, if so, returns the posts from that cache, if not, returns null.
  getPostsForTab: (tab) => {
    const entry = get().postsByTab[tab];
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.posts;
    }
    return null;
  },

  // Returns true if there is a valid cache for the tab, without needing to return the posts.
  isCacheValid: (tab) => {
    const entry = get().postsByTab[tab];
    return !!entry && Date.now() - entry.timestamp < CACHE_TTL;
  },

  // Function that accesses the current cache of the selected tab, checks if it exists, if not, does nothing. If there is a cache, it makes a map inside it and updates the post with the new one, avoiding making a general call of all posts - this call does not perpetuate the cache, it ends after a while.
  updateSinglePost: (tab, updatedPost) => {
    const entry = get().postsByTab[tab];
    if (!entry) return;
    const updatedPosts = entry.posts.map((p) =>
      p.id === updatedPost.id ? updatedPost : p
    );
    set((state) => ({
      postsByTab: {
        ...state.postsByTab,
        [tab]: { posts: updatedPosts, timestamp: entry.timestamp },
      },
    }));
  },
}));
