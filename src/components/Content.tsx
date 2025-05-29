import { useEffect, useCallback, useMemo } from "react";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import { useVoteStore } from "../store/useVoteStore";
import { fetchPosts } from "../services/productHuntService";
import iconbase from '../assets/icon-base.avif'
import iconactive from '../assets/icon-active.avif'
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
    <div className="flex flex-1 flex-col overflow-y-auto p-4 pt-4 pr-8  bg-gray-100">
    {orderedPosts.map((post, index) => {
        const isUpvoted = justVoted[post.id] === true;

        return (
          <div
            key={`${post.id}-${index}`}
            className="mb-2 mt-2 py-3 pr-6 pl-4 bg-white rounded-xl flex gap-4 items-center cursor-pointer"
          >
            <img
              src={post.thumbnail.url}
              alt={post.name}
              className="w-16 h-16 object-cover rounded-lg"
              loading="lazy"
            />
            <div className="flex flex-col flex-1 pr-6">
              <h2 className="font-bold">{post.name}</h2>
              <p className="text-sm text-gray-600">{post.tagline}</p>
            </div>

           <div
              className={`flex flex-col items-center rounded-2xl px-4 py-1 absolute right-3
                ${isUpvoted ? "bg-[#FF6154] border-[#FF6154]" : "bg-white border-gray-200"} 
                border`}
            >
              <img
                src={isUpvoted ? iconactive : iconbase}
                alt="icon"
                className="h-8"
              />
              <span
                className={`font-bold ${
                  isUpvoted ? "text-white" : "text-gray-800"
                }`}
              >
                {voteMap[post.id] ?? post.votesCount}
              </span>
            </div>
          </div>
        );
      })}
      {loading && <p className="text-center py-4">Loading...</p>}
    </div>
  );
};

export default Content;
