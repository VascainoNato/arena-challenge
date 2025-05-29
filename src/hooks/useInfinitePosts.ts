// src/hooks/useInfinitePosts.ts
import { useEffect, useState } from "react";
import type { Post } from "../types/post";
import { fetchPosts } from "../services/productHuntService";

// Nosso Hook customizado para scroll infinito com Product Hunt
export const useInfinitePosts = (order: "RANKING" | "NEWEST") => {
  // Lista dos posts carregados
  const [posts, setPosts] = useState<Post[]>([]);
  // Controle de loading
  const [loading, setLoading] = useState(false);
  // Controle de paginação (cursor)
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  // Saber se ainda há mais dados para carregar
  const [hasMore, setHasMore] = useState(true);

  // Função para carregar mais dados
  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const data = await fetchPosts(order, cursor);
      const newPosts = data.edges.map((edge: any) => edge.node);

      setPosts(prev => [...prev, ...newPosts]);
      setCursor(data.edges[data.edges.length - 1]?.cursor);
      setHasMore(data.pageInfo.hasNextPage);
    } catch (err) {
      console.error("Erro ao carregar posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os primeiros dados ao montar
  useEffect(() => {
    loadMore();
  }, [order]);

  return { posts, loadMore, hasMore, loading };
};
