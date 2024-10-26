import { useEffect, useState, useRef } from "react";
import { getExplorePosts } from "@/api/api";
import { Alert } from "../../ui/alert";
import PostCard from "@/components/features/postPage/postCard";

interface User {
  id: string;
  username: string;
  profilePictureUrl: string;
}

interface Post {
  id: string;
  caption: string;
  imageUrl?: string;
  totalLikes: number;
  user?: User;
  isLiked?: boolean;
}

const Explore = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchPosts = async (page: number) => {
    try {
      const response = await getExplorePosts(10, page);
      const postsData = response.data.data.posts.map((post: Post) => ({
        ...post,
        isLiked: post.isLiked || false,
      }));
      setPosts((prevPosts) => [...prevPosts, ...postsData]);
      if (postsData.length === 0) {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch posts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const lastPostRef = (node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  const handleClosePostCard = () => {
    setSelectedPostId(null); // Close the PostCard
  };

  return (
    <div className="glassmorphism flex flex-col items-center justify-center min-h-100vh relative">
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 w-full max-w-7xl">
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
            onClick={() => setSelectedPostId(post.id)}
            className="cursor-pointer relative group"
          >
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="w-full h-64 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.src =
                  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"; // Set placeholder image on error
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-white">
              {post.user && (
                <>
                  <img
                    src={post.user.profilePictureUrl}
                    alt={post.user.username}
                    className="w-16 h-16 rounded-full mb-2"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"; // Set placeholder image on error
                    }}
                  />
                  <p className="font-bold">{post.user.username}</p>
                  <p className="mt-1">{post.caption}</p>
                  <p className="mt-1">❤️ {post.totalLikes}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPostId && (
        <>
          {/* Backdrop for blur effect */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={handleClosePostCard} // Close PostCard on backdrop click
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="max-w-md w-full sticky mt-[50vh] transform -translate-y-1/2">
              <PostCard postId={selectedPostId} />
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <svg
            className="animate-spin h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Explore;
