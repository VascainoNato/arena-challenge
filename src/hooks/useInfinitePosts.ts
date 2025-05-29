import { useEffect, useState } from "react";
import type { Post } from "../types/post";
import { fetchPosts } from "../services/productHuntService";

export const useInfinitePosts = (order: "RANKING" | "NEWEST") => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [lastCall, setLastCall] = useState(Date.now()); // controle de tempo

  const loadMore = async () => {
    const now = Date.now();
    if (loading || !hasMore || now - lastCall < 1000) return;
    setLastCall(now);
    setLoading(true);

    try {
      const data = await fetchPosts(order, cursor);

      if (!data?.edges || !Array.isArray(data.edges)) {
        console.warn("Sem dados válidos retornados da API.");
        setHasMore(false);
        return;
      }

      const newPosts = data.edges.map((edge: any) => edge.node);

      // Evita duplicados por id
      const novosUnicos = newPosts.filter(
        (novo: Post) => !posts.some((existente) => existente.id === novo.id)
      );

      setPosts(prev => [...prev, ...novosUnicos]);
      setCursor(data.edges[data.edges.length - 1]?.cursor);
      setHasMore(data.pageInfo.hasNextPage);
    } catch (err: any) {
      if (err.response?.status === 429) {
        console.warn("Rate limit excedido. Tente novamente em alguns minutos.");
        setHasMore(false); // opcional
      } else {
        console.error("Erro ao carregar posts:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && posts.length === 0) {
      loadMore();
    }
  }, [order]);

  return { posts, loadMore, hasMore, loading };
};
