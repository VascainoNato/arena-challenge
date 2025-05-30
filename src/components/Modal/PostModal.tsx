import type { Post } from "../../types/post";

type PostModalProps = {
  post: Post;
  onClose: () => void;
};

const PostModal = ({ post, onClose }: PostModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[95%] md:w-[70%] md:h-[50%] lg:w-[60%] xl:w-[60%] xl:h-[40%] xl:p-10 2xl:w-[40%] 2xl:h-[55%] overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-lg font-bold dark:text-[#f3f4f6] ">✕</button>
        <h2 className="text-2xl font-bold mb-2 dark:text-white 2xl:mb-8">{post.name}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 2xl:mb-8">{post.description}</p>

        <div className="flex gap-2 overflow-x-auto mb-4">
          {post.media.map((m) => (
            <img key={m.url} src={m.url} alt="" className="h-40 rounded" loading="lazy"/>
          ))}
        </div>
        <div className="flex w-full pt-6 gap-6">
         <a
          href={post.website ?? `https://www.producthunt.com/posts/${post.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center bg-white border-2 border-gray-200 dark:bg-[#1f2937] dark:border-[#374151] dark:text-[#f3f4f6] p-3 rounded-lg "
        >
            <button className="flex w-full items-center justify-center"> Visit Page</button>
        </a> 
        <button className="flex w-full justify-center items-center bg-[#FF6154] border-[#FF6154] rounded-lg text-white">Upvote</button>
         </div>
       
      </div>
    </div>
  );
};

export default PostModal;
