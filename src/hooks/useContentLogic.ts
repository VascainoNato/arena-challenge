import { useEffect, useCallback, useMemo } from "react";
import { useInfinitePosts } from "./infinitePosts/useInfinitePosts";
import { useVoteStore } from "../store/useVoteStore";
import { fetchVotesOnly } from "../services/productHuntService";
import type { Post } from "../types/post";

let debounceTimeout: NodeJS.Timeout;

export function useContentLogic(order: "RANKING" | "NEWEST") {
  // Calls the main hook that manages the paginated posts of the selected tab.
  const { posts, loadMore, hasMore, loading } = useInfinitePosts(order);
  // Access to the Zustand Store which: Stores the current post vote count and marks which posts the user has voted on recently - used to change the style of buttons.
  const { voteMap, justVoted } = useVoteStore();

  // Infinite Scroll - With useCallback to avoid unecessary re-render.
  const handleScroll = useCallback(() => {
    // Calculates if the user is close to the end of the page - 100px before finishing - Combination of: viewport height, how far scrolled and total content height.
    const bottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
     // Attempts to load more posts if the user has reached the end, there are more posts to fetch from the API and no LoadMore requests are in progress.  
    if (bottom && hasMore && !loading) {
        // clear a possible running timeout to avoid unecessary loadMore calls.
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        loadMore();
      });
    }
    // useCallback depends on these variables, the scroll only runs if one of those change.
  }, [hasMore, loading, loadMore]);

  // Listener to add the scroll hearer when the component mount or order change.
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // When unmounting the component or changing the order, remove the listener to avoid multiple parallel executions or memory leaks.
    return () => window.removeEventListener("scroll", handleScroll);
    // The effect are remounted when: HandleScroll change or order change.
  }, [handleScroll, order]);

  // This useEffect is an autofill that ensures the screen never looks incomplete. It detects when the content has not yet exceeded the height of the window, and forces a new call to fetch more posts, all invisibly and seamlessly.
  useEffect(() => {
    const fillIfNotScrollable = async () => {
      if (
        document.body.scrollHeight <= window.innerHeight &&
        hasMore &&
        !loading
      ) {
        await loadMore();
      }
    };
    fillIfNotScrollable();
  }, [posts.length, order]);

  // UseEffect responsible for updating the vote count in the global state.
  useEffect(() => {
    if (order !== "RANKING") return;

    let retryTimeout = 90000;
    let timeoutId: NodeJS.Timeout;

    const updateVotes = async () => {
      try {
        const data = await fetchVotesOnly(order);
        const novos = data.edges.map((edge: any) => edge.node);
        const newVotes: Record<string, number> = {};
        novos.forEach((post: Post) => {
          newVotes[post.id] = post.votesCount;
        });
        useVoteStore.getState().updateVotes(newVotes);
        retryTimeout = 90000;
      } catch (err: any) {
        if (err?.response?.status === 429) {
          retryTimeout = Math.min(retryTimeout * 2, 90000);
        }
      }
      timeoutId = setTimeout(updateVotes, retryTimeout);
    };
    timeoutId = setTimeout(updateVotes, retryTimeout);
    return () => clearTimeout(timeoutId);
  }, [order]);

  // UseMemo responsible for ordering posts according to updated votes.
  const orderedPosts = useMemo(() => {
    if (order !== "RANKING") return posts;
    return [...posts].sort(
      (a, b) =>
        (voteMap[b.id] ?? b.votesCount) - (voteMap[a.id] ?? a.votesCount)
    );
  }, [posts, voteMap, order]);

  return { orderedPosts, justVoted, loading };
}
