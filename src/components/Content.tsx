import { useEffect, useCallback, useMemo } from "react";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import { useVoteStore } from "../store/useVoteStore";
import { fetchPosts } from "../services/productHuntService";
import type { Post } from "../types/post";

let debounceTimeout: NodeJS.Timeout;

type ContentProps = {
  order: 'RANKING' | 'NEWEST';
};

const Content = ({ order }: ContentProps) => {
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, order]);

  // Se os primeiros 10 posts forem insuficientes para preencher a tela, carrega mais
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

        retryTimeout = 15000; // ✅ reset em sucesso
      } catch (err: any) {
        console.error("Erro ao atualizar votos:", err);

        if (err?.response?.status === 429) {
          retryTimeout = Math.min(retryTimeout * 2, 60000); // ⏱️ aplica backoff
          console.warn(`Rate limited. Reagendando em ${retryTimeout / 1000}s`);
        }
      }

      timeoutId = setTimeout(updateVotes, retryTimeout); 
    };

    timeoutId = setTimeout(updateVotes, retryTimeout); // ⏳ primeira chamada

    return () => clearTimeout(timeoutId); 
  }, [order]);

  const orderedPosts = useMemo(() => {
    if (order !== "RANKING") return posts;

    return [...posts].sort(
      (a, b) =>
        (voteMap[b.id] ?? b.votesCount) - (voteMap[a.id] ?? a.votesCount)
    );
  }, [posts, voteMap, order]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4">
      {orderedPosts.map((post, index) => (
        <div key={`${post.id}-${index}`} className="mb-2 mt-2 py-3 px-4 bg-white rounded-xl flex gap-4 items-center cursor-pointer">
          <img
            src={post.thumbnail.url}
            alt={post.name}
            className="w-20 h-20 object-cover rounded-lg"
            loading="lazy"
          />
          <div className="flex flex-col flex-1">
            <h2 className="font-bold">{post.name}</h2>
            <p className="text-sm text-gray-600">{post.tagline}</p>
          </div>    
         
          <span
            className={`font-bold ${
              justVoted[post.id] ? "text-orange-500" : "text-gray-800"
            }`}
          >
            {(voteMap[post.id] ?? post.votesCount)} votes
          </span>
        </div>
      ))}
      {loading && <p className="text-center py-4">Loading...</p>}
    </div>
  );
};

export default Content;
