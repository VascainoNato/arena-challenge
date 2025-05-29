import { useEffect, useCallback } from "react";
import { useInfinitePosts } from "../hooks/useInfinitePosts";

let debounceTimeout: NodeJS.Timeout;

const Content = () => {
  const { posts, loadMore, hasMore, loading } = useInfinitePosts("RANKING");

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
  }, [handleScroll]);

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
  }, [posts.length]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4">
      {posts.map((post, index) => (
        <div key={`${post.id}-${index}`} className="mb-2 mt-2 p-2 bg-white rounded-xl flex gap-4 items-center">
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
          <span className="text-orange-500 font-bold">{post.votesCount} votes</span>
        </div>
      ))}
      {loading && <p className="text-center py-4">Loading...</p>}
    </div>
  );
};

export default Content;
