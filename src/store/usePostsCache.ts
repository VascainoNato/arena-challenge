import { create } from 'zustand';
import type { CachedPosts, Post } from '../types/post';

type TabType = 'RANKING' | 'NEWEST';

interface PostsCacheState {
  postsByTab: Record<TabType, CachedPosts | undefined>;
  setPostsForTab: (tab: TabType, posts: Post[]) => void;
  getPostsForTab: (tab: TabType) => Post[] | null;
  isCacheValid: (tab: TabType) => boolean;
  updateSinglePost: (tab: TabType, updatedPost: Post) => void;
}

const CACHE_TTL = 60 * 1000; 

export const usePostsCache = create<PostsCacheState>((set, get) => ({
  postsByTab: {
      RANKING: undefined,
      NEWEST: undefined
  },

  setPostsForTab: (tab, posts) => {
    set((state) => ({
      postsByTab: {
        ...state.postsByTab,
        [tab]: { posts, timestamp: Date.now() },
      },
    }));
  },

  getPostsForTab: (tab) => {
    const entry = get().postsByTab[tab];
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.posts;
    }
    return null;
  },

  isCacheValid: (tab) => {
    const entry = get().postsByTab[tab];
    return !!entry && Date.now() - entry.timestamp < CACHE_TTL;
  },

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
