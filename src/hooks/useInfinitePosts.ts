import { useEffect, useState } from "react";
import type { Post } from "../types/post";
import { fetchPosts } from "../services/productHuntService";

export const useInfinitePosts = (order: "RANKING" | "NEWEST") => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [lastCall, setLastCall] = useState(Date.now());

  // 🚀 CHAMADA INICIAL
  const loadInitial = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts(order);
      const newPosts = data.edges.map((edge: any) => edge.node);

      const filtrados =
        order === "RANKING"
          ? newPosts.filter((post: Post) => post.votesCount >= 20)
          : newPosts;

      setPosts(filtrados);
      setCursor(data.edges[data.edges.length - 1]?.cursor);
      setHasMore(data.pageInfo.hasNextPage);
    } catch (err: any) {
      console.error("Erro ao carregar posts iniciais:", err);
    } finally {
      setLoading(false);
    }
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

      setPosts(prev => [...prev, ...novosUnicos]);
      setCursor(data.edges[data.edges.length - 1]?.cursor);
      setHasMore(data.pageInfo.hasNextPage);
    } catch (err: any) {
      console.error("Erro ao carregar mais posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Quando o `order` muda, resetar tudo e buscar novamente
  useEffect(() => {
    setPosts([]);
    setCursor(undefined);
    setHasMore(true);
    setLastCall(Date.now());

    loadInitial();
  }, [order]);

  return { posts, loadMore, hasMore, loading };
};
