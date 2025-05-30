import { useContentLogic } from "../hooks/useContentLogic";
import iconbase from "../assets/icon-base.avif";
import iconactive from "../assets/icon-active.avif";
import iconchatbase from "../assets/icon-chat-base.avif";
import iconchatactive from "../assets/icon-chat-active.avif";
import type { Post } from "../types/post";
import { useState } from "react";
import PostModal from "./Modal/PostModal";

type ContentProps = {
  order: "RANKING" | "NEWEST";
};

const Content = ({ order }: ContentProps) => {
  const { orderedPosts, justVoted, loading } = useContentLogic(order);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4 pt-2 pr-8 bg-gray-100 xl:justify-center xl:items-center dark:bg-[#111827]">
      <h1 className="hidden md:flex justify-start items-start w-full md:pl-4 md:pt-4 md:pb-4 md:font-semibold xl:w-full xl:max-w-7xl dark:text-[#f3f4f6]">
        Top Launching Products
      </h1>

      {orderedPosts.map((post, index) => {
        const isUpvoted = justVoted[post.id] === true;

        return (
          <div
            key={`${post.id}-${index}`} onClick={() => setSelectedPost(post)}
            className="mb-2 mt-2 py-3 pr-6 pl-4 md:pr-3 md:pl-3 bg-white dark:bg-[#1f2937] rounded-xl flex gap-4 items-center cursor-pointer xl:w-full xl:max-w-7xl"
          >
            <img
              src={post.thumbnail.url}
              alt={post.name}
              className="w-16 h-16 object-cover rounded-lg"
              loading="lazy"
            />
            <div className="flex flex-col flex-1 pr-10">
              <h2 className="font-bold dark:text-[#f3f4f6]">{post.name}</h2>
              <p className="text-sm text-gray-600 dark:text-[#f3f4f6]">{post.tagline}</p>
            </div>
            <div
              className={`flex-col items-center rounded-2xl px-4 py-1 hidden md:flex border-2 ${
                isUpvoted
                  ? "bg-[#FF6154] border-[#FF6154]"
                  : "bg-white border-gray-200 dark:bg-[#1f2937] dark:border-[#374151] dark:text-[#f3f4f6]"
              }`}
            >
              <img
                src={isUpvoted ? iconchatactive : iconchatbase}
                alt="icon"
                className="h-8"
              />
              <span
                className={`font-bold ${
                  isUpvoted ? "text-white dark:text-[#f3f4f6]" : "text-gray-600 dark:text-[#f3f4f6]"
                }`}
              >
                {post.votesCount}
              </span>
            </div>
            
            <div
              className={`flex flex-col items-center rounded-2xl px-4 py-1 absolute md:static right-3 ${
                isUpvoted
                  ? "bg-[#FF6154] border-[#FF6154]"
                  : "bg-white border-gray-200 dark:bg-[#1f2937] dark:border-[#374151]"
              } border-2`}
            >
              <img
                src={isUpvoted ? iconactive : iconbase}
                alt="icon"
                className="h-8"
              />
              <span
                className={`font-bold ${
                  isUpvoted ? "text-white dark:text-[#f3f4f6]" : "text-gray-600 dark:text-[#f3f4f6]"
                }`}
              >
                {post.votesCount}
              </span>
            </div>
          </div>
        );
      })}
      {loading && (
        <div
          data-testid="skeleton"
          className="flex justify-center items-center flex-1 h-full"
        >
          <div className="flex space-x-2 text-2xl text-[#FF6154]">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-200">.</span>
            <span className="animate-bounce delay-400">.</span>
          </div>
        </div>
      )}
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
    
  );
};

export default Content;
