import { useEffect, useState } from "react";
import type { Post } from "../types/post";
import { fetchPosts } from "../services/productHuntService";
import { useVoteStore } from "../store/useVoteStore";

export const useInfinitePosts = (order: "RANKING" | "NEWEST") => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [lastCall, setLastCall] = useState(Date.now());

  // 🚀 CHAMADA INICIAL
  const loadInitial = async () => {
  let retryTimeout = 5000;
  let cancelRetry = false;

  const tentar = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts(order);
      const newPosts = data.edges.map((edge: any) => edge.node);

      const filtrados =
        order === "RANKING"
          ? newPosts.filter((post: Post) => post.votesCount >= 20)
          : newPosts;

      setPosts(filtrados);

      if (order === "RANKING") {
        const voteMap: Record<string, number> = {};
        filtrados.forEach((p: Post) => {
          voteMap[p.id] = p.votesCount;
        });
        useVoteStore.getState().updateVotes(voteMap);
      }

      setCursor(data.edges[data.edges.length - 1]?.cursor);
      setHasMore(data.pageInfo.hasNextPage);
      setLoading(false);
    } catch (err: any) {
      console.error("Erro ao carregar posts iniciais:", err);

      if (err?.response?.status === 429) {
        retryTimeout = Math.min(retryTimeout * 2, 60000);
        console.warn(`Rate limited. Tentando novamente em ${retryTimeout / 1000}s`);

        if (!cancelRetry) {
          setTimeout(() => {
            if (!cancelRetry) {
              tentar(); // retry
            }
          }, retryTimeout);
        }
      } else {
        setLoading(false);
      }
    }
  };

  tentar();

  // cleanup quando desmontar ou mudar o `order`
  return () => {
    cancelRetry = true;
  };
};

  // 🌀 Scroll infinito
  const loadMore = async () => {
    const now = Date.now();
    if (loading || !hasMore || now - lastCall < 1000) return;

    setLastCall(now);
    setLoading(true);

    try {
      const data = await fetchPosts(order, cursor);
      const newPosts = data.edges.map((edge: any) => edge.node);

      const filtrados =
        order === "RANKING"
          ? newPosts.filter((post: Post) => post.votesCount >= 20)
          : newPosts;

      const novosUnicos = filtrados.filter(
        (novo: Post) => !posts.some((existente) => existente.id === novo.id)
      );

      const atualizados = [...posts, ...novosUnicos];

      setPosts(prev => [...prev, ...novosUnicos]);
      setCursor(data.edges[data.edges.length - 1]?.cursor);
      setHasMore(data.pageInfo.hasNextPage);

      if (order === "RANKING") {
        const voteMap: Record<string, number> = {};
        atualizados.forEach((p) => {
          voteMap[p.id] = p.votesCount;
        });
        useVoteStore.getState().updateVotes(voteMap);
      }

    } catch (err: any) {
      console.error("Erro ao carregar mais posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setCursor(undefined);
    setHasMore(true);
    setLastCall(Date.now());

    const cleanup = loadInitial();

    return () => {
      if (cleanup instanceof Function) cleanup();
    };
  }, [order]);

  return { posts, loadMore, hasMore, loading };
};
