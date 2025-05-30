import { useEffect, useReducer } from "react";
import type { Post } from "../../types/post";
import { fetchPosts } from "../../services/productHuntService";
import { useVoteStore } from "../../store/useVoteStore";
import { usePostsCache } from "../../store/usePostsCache";
import {
  infinitePostsReducer
} from "./reducer";
import {
  initialInfinitePostsState
} from "./initialState";
import {
  setPosts,
  addPosts,
  setCursor,
  setHasMore,
  setLoading,
  setLastCall,
  resetState,
} from "./actions";

export const useInfinitePosts = (order: "RANKING" | "NEWEST") => {
  // Here we initialize the reducer with  local global state (posts, loading, cursor, etc.).
  const [state, dispatch] = useReducer(
    infinitePostsReducer, // function that defines how the state changes.
    initialInfinitePostsState // initial state (empty posts, loading false, etc.).
  );

  // Extract utilities from the global cache of the current tab (RANKING or NEWEST).
  const { getPostsForTab, isCacheValid, setPostsForTab } = usePostsCache.getState();

  // Extract the relevant fields from the reducer's local state
  const { posts, loading, cursor, hasMore, lastCall } = state;

  // Initial Call - Create the first posts for the page.
  const loadInitial = async () => {
    let retryTimeout = 5000;  
    let cancelRetry = false;
    let retryAttempted = false;

    // Searches the cache for posts from the current tab (ranking or newest).
    const cached = getPostsForTab(order);
    if (cached && isCacheValid(order)) {
      dispatch(setPosts(cached));
      dispatch(setLoading(false));
      return () => {};
    }

    // Function responsible for trying to assemble/list the posts.
    const tryMount = async () => {
      // Activates the skeleton loading.
      dispatch(setLoading(true));
      try {
        const data = await fetchPosts(order);
        const newPosts = data.edges.map((edge: any) => edge.node);

        // Filters only popular posts.
        const filtered =
          order === "RANKING"
            ? newPosts.filter((post: Post) => post.votesCount >= 20)
            : newPosts;

        // update the state with the posts and save it in cache.
        dispatch(setPosts(filtered));
        setPostsForTab(order, filtered);

        // Updates the Zustand global store if it is in the ranking - sorting tab. 
        if (order === "RANKING") {
          const voteMap: Record<string, number> = {};
          filtered.forEach((p: Post) => {
            voteMap[p.id] = p.votesCount;
          });
          useVoteStore.getState().updateVotes(voteMap);
        }

        // // sets the last page cursor
        dispatch(setCursor(data.edges.at(-1)?.cursor));
        // indicates if there are more pages
        dispatch(setHasMore(data.pageInfo.hasNextPage));
        // turn off loading
        dispatch(setLoading(false));
      } catch (err: any) {
        console.error("Error loading initial posts", err);

         // Identify if there was an error 429, excessive query in the Product Hunt API.
        if (err?.response?.status === 429 && !retryAttempted) {
          retryAttempted = true;
          retryTimeout = Math.min(retryTimeout * 2, 60000);
          console.warn(`Rate limited. Trying again in ${retryTimeout / 1000}s`);

         // If the mounted component was not canceled, we schedule a new attempt.
          if (!cancelRetry) {
            setTimeout(() => {
              // Double check that the component is still active before trying again.
              if (!cancelRetry) {
                // Try running the mount function again.
                tryMount();
              }
            }, retryTimeout);
          }
        } else {
          // If the error is not 429 or has already been tried before, just cancel the loading.
          dispatch(setLoading(false));
        }
      }
    };
    tryMount();
    return () => {
      cancelRetry = true;
    };
  };

  // LoadMore Posts - Infinite Scroll
  const loadMore = async () => {
    // Capture the current timestamp to control request timing (debounce).
    const now = Date.now();
    // Prevents: Already loading, no more posts to fetch, last fetch was less than 1 second - to avoid spamming requests.
    if (loading || !hasMore || now - lastCall < 1000) return;

    dispatch(setLastCall(now));
    dispatch(setLoading(true));

    try {
      // Makes an API request to fetch posts using the current order and pagination cursor.
      const data = await fetchPosts(order, cursor);
      // Extracts actual Post objects from the GraphQL edges format.
      const newPosts = data.edges.map((edge: any) => edge.node);

      // If using "RANKING" tab, optionally filters posts.
      const filtered =
        order === "RANKING"
          ? newPosts.filter((post: Post) => post.votesCount >= 0)
          : newPosts;

      // Avoid duplicated items on the list    
      const newUniquePosts = filtered.filter(
        (novo: Post) => !posts.some((existing) => existing.id === novo.id)
      );

      // Creates a new list combining current posts with the new unique ones.
      const updated = [...posts, ...newUniquePosts];

      // Adds the new posts to state via reducer (preserving the existing list).
      dispatch(addPosts(newUniquePosts));
      // Updates the pagination cursor for the next API request - uses last item's cursor.
      dispatch(setCursor(data.edges.at(-1)?.cursor));
      // Indicates whether more pages are available to continue infinite scrolling.
      dispatch(setHasMore(data.pageInfo.hasNextPage));

      // updates a global vote store with the latest vote counts and ensure real-time reactivity of upvote displays.
      if (order === "RANKING") {
        const voteMap: Record<string, number> = {};
        updated.forEach((p) => {
          voteMap[p.id] = p.votesCount;
        });
        useVoteStore.getState().updateVotes(voteMap);
      }
    } catch (err: any) {
      console.error("Erro ao carregar mais posts:", err);
    } finally {
      // Always turns off the loading state at the end, regardless of success or failure.
      dispatch(setLoading(false));
    }
  };

  // Whenever you change the order, reset and load
  useEffect(() => {
    // Resets the entire post state (clears posts, loading, cursor, etc.)
    dispatch(resetState());
    // Checks if there is a valid cache and uses it if available, if not, consults the API, returns a cleanup function that cancels the retry if the component is unmounted.
    const cleanup = loadInitial();
    // Manual vote refresh interval, used to keep visual data updated in the interface, even without switching tabs or reloading the page.
    const voteInterval = setInterval(async () => {
      try {
        const data = await fetchPosts(order);
        const newPosts = data.edges.map((edge: any) => edge.node);

        if (order === "RANKING") {
          const voteMap: Record<string, number> = {};
          newPosts.forEach((p: Post) => {
            voteMap[p.id] = p.votesCount;
          });
          useVoteStore.getState().updateVotes(voteMap);
        }
      } catch {
        console.warn("Error updating votes. Skipping until next round.");
      }
    }, 180_000);

    return () => {
      if (cleanup instanceof Function) cleanup();
      clearInterval(voteInterval);
    };
  }, [order]);

  return { posts, loadMore, hasMore, loading };
};