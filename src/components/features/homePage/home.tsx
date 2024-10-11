import { useEffect, useState } from "react";
import {
  getFollowingPosts,
  getPostById,
  createComment,
  deleteComment,
  likePost,
  unlikePost,
} from "@/api/api";
import { useRouter } from "next/router";
import { Card } from "../../ui/card";
import { Alert } from "../../ui/alert";
import { Heart, MessageCircle } from "lucide-react";

interface User {
  id: string;
  username: string;
  profilePictureUrl: string;
}

interface Comment {
  id: string; // ID komentar
  content: string; // Konten komentar
  user: User; // Pengguna yang membuat komentar
}

interface Post {
  id: string;
  caption: string;
  imageUrl?: string;
  totalLikes: number;
  user?: User;
  isLiked?: boolean;
  comments: Comment[]; // Menyimpan daftar komentar
  showCommentInput?: boolean; // Kontrol visibilitas input komentar
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const response = await getFollowingPosts(10, 1);
      const postsData = await Promise.all(
        response.data.data.posts.map(async (post: Post) => {
          const postResponse = await getPostById(post.id);
          return {
            ...post,
            isLiked: post.isLiked || false,
            showCommentInput: false,
            comments: postResponse.data.data.comments || [],
          };
        })
      );
      setPosts(postsData);
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
    fetchPosts();
  }, []);

  const handlePostClick = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handleLike = async (postId: string, index: number) => {
    try {
      await likePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post, i) =>
          i === index
            ? { ...post, totalLikes: post.totalLikes + 1, isLiked: true }
            : post
        )
      );
    } catch (err: any) {
      console.error("Like Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to like post"
      );
    }
  };

  const handleUnlike = async (postId: string, index: number) => {
    try {
      await unlikePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post, i) =>
          i === index
            ? { ...post, totalLikes: post.totalLikes - 1, isLiked: false }
            : post
        )
      );
    } catch (err: any) {
      console.error("Unlike Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to unlike post"
      );
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const comment = newComment[postId];
    if (!comment) return;
    try {
      const response = await createComment(postId, comment);
      const newCommentData = {
        id: response.data.data.commentId,
        content: comment,
        user: response.data.data.user,
      };
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newCommentData] }
            : post
        )
      );
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    } catch (err: any) {
      console.error("Comment Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to submit comment"
      );
    }
  };

  const handleCommentDelete = async (postId: string, commentId: string) => {
    try {
      await deleteComment(commentId);
      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.filter((comment) => comment.id !== commentId),
        }))
      );
    } catch (err: any) {
      console.error("Delete Comment Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to delete comment"
      );
    }
  };

  const toggleCommentInput = (index: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post, i) =>
        i === index
          ? { ...post, showCommentInput: !post.showCommentInput }
          : post
      )
    );
  };

  return (
    <div className="bg-purple flex flex-col items-center justify-center min-h-screen bg-transparent">
      <h1 className="mb-4 text-2xl font-bold text-green-700 m-[4%]">Feeds.</h1>
      {error && <Alert variant="destructive">{error}</Alert>}
      <div className="flex flex-col gap-10 items-center">
        {posts.map((post: Post, index: number) => (
          <Card
            key={post.id}
            className="p-4 h-[600px] w-[500px] flex flex-col justify-center rounded-lg shadow-lg glassmorphism"
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="self-center object-cover w-full h-48 rounded-md cursor-pointer"
                onClick={() => handlePostClick(post.id)}
              />
            )}
            <h2 className="mt-2 text-xl font-semibold text-white">
              {post.caption}
            </h2>
            <p className="text-gray-200">
              <span className="font-medium">Total Likes: </span>
              {post.totalLikes}
            </p>
            {post.user && (
              <div
                className="flex items-center mt-2 cursor-pointer"
                onClick={() => router.push(`/profile/${post.user?.id}`)}
              >
                <img
                  src={post.user?.profilePictureUrl}
                  alt={post.user?.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2 text-white">{post.user?.username}</span>
              </div>
            )}
            <div className="flex justify-start items-center mt-4 gap-4">
              <button
                onClick={() => {
                  post.isLiked
                    ? handleUnlike(post.id, index)
                    : handleLike(post.id, index);
                }}
              >
                <Heart
                  color={post.isLiked ? "red" : "white"}
                  fill={post.isLiked ? "red" : "none"}
                />
              </button>
              <button onClick={() => toggleCommentInput(index)}>
                <MessageCircle color="white" />
              </button>
            </div>
            {post.showCommentInput && (
              <div className="mt-4 flex items-center">
                <input
                  type="text"
                  className="border rounded-lg p-2 flex-grow bg-transparent text-white placeholder-gray-400 border-gray-500"
                  placeholder="Write a comment..."
                  value={newComment[post.id] || ""}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                />
                <button
                  className="bg-blue-500 text-white rounded-lg px-4 py-2 ml-2"
                  onClick={() => handleCommentSubmit(post.id)}
                >
                  Submit
                </button>
              </div>
            )}
            <div className="mt-2">
              {post.comments.map((comment) => (
                <div key={comment.id} className="py-2 flex gap-2 items-center">
                  <span className="font-bold text-white">
                    {comment.user.username}:
                  </span>{" "}
                  <span className="text-gray-200">{comment.content}</span>
                  <button
                    onClick={() => handleCommentDelete(post.id, comment.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
