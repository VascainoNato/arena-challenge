import { useEffect } from "react";
import { useInfinitePosts } from "../hooks/useInfinitePosts";


const Content = () => {
  const { posts, loadMore, hasMore, loading } = useInfinitePosts("RANKING");

  // Detecta o fim da página para carregar mais
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (bottom && hasMore && !loading) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadMore]);
  return (
  <>
    <div className="flex flex-col bg-gray-100 min-h-screen h-screen">
      {posts.map(post => (
        <div key={post.id} className="mb-4 border-b pb-4">
          <img src={post.thumbnail.url} alt={post.name} className="w-20" />
          <h2 className="font-bold">{post.name}</h2>
          <p className="text-sm text-gray-600">{post.description}</p>
          <span className="text-orange-500 font-bold">{post.votesCount} votes</span>
        </div>
      ))}
      {loading && <p className="text-center py-4">Loading...</p>}
    </div>
  </>
  );
};

export default Content;
