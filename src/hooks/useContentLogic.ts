import { useEffect, useCallback, useMemo } from "react";
import { useInfinitePosts } from "./useInfinitePosts";
import { useVoteStore } from "../store/useVoteStore";
import { fetchPosts } from "../services/productHuntService";
import type { Post } from "../types/post";

let debounceTimeout: NodeJS.Timeout;

export function useContentLogic(order: "RANKING" | "NEWEST") {
  const { posts, loadMore, hasMore, loading } = useInfinitePosts(order);
  const { voteMap, justVoted } = useVoteStore();

  // Scroll infinito
  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (bottom && hasMore && !loading) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        loadMore();
      });
    }
  }, [hasMore, loading, loadMore]);

  // Listeners e preenchimento automático
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, order]);

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

  useEffect(() => {
    if (order !== "RANKING") return;

    let retryTimeout = 15000;
    let timeoutId: NodeJS.Timeout;

    const updateVotes = async () => {
      try {
        const data = await fetchPosts(order);
        const novos = data.edges.map((edge: any) => edge.node);
        const newVotes: Record<string, number> = {};
        novos.forEach((post: Post) => {
          newVotes[post.id] = post.votesCount;
        });
        useVoteStore.getState().updateVotes(newVotes);
        retryTimeout = 15000;
      } catch (err: any) {
        if (err?.response?.status === 429) {
          retryTimeout = Math.min(retryTimeout * 2, 60000);
        }
      }
      timeoutId = setTimeout(updateVotes, retryTimeout);
    };

    timeoutId = setTimeout(updateVotes, retryTimeout);

    return () => clearTimeout(timeoutId);
  }, [order]);

  const orderedPosts = useMemo(() => {
    if (order !== "RANKING") return posts;
    return [...posts].sort(
      (a, b) =>
        (voteMap[b.id] ?? b.votesCount) - (voteMap[a.id] ?? a.votesCount)
    );
  }, [posts, voteMap, order]);

  return { orderedPosts, justVoted, loading };
}
