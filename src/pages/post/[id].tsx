import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getPostById } from "@/api/api";

interface User {
  id: string;
  username: string;
  profilePictureUrl: string;
}

interface Comment {
  id: string;
  comment: string;
  user: User;
}

interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  user: User;
  comments: Comment[];
}

const PostPage: React.FC = () => {
  const router = useRouter();
  const { id : postId } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(postId)
    const fetchPost = async () => {
      if (!postId) return; 

      try {
        const response = await getPostById(postId as string); // Call your API function
        if (response.data.code === "200") {
          setPost(response.data.data);
        } else {
          setError("Post not found"); // Handle case where post isn't found
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("An error occurred while fetching the post."); // Set a user-friendly error message
      }
    };

    fetchPost();
  }, [postId]);

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  if (!post) {
    return <div>Post not found.</div>; // Handle case where post is not set
  }

  return (
    <div className="h-full p-4 flex flex-col justify-center items-center">
      <div className="mb-4">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-28 h-auto rounded"
        />
      </div>
      <div className="flex items-center mb-2">
        <img
          src={post.user.profilePictureUrl}
          alt={post.user.username}
          className="w-10 h-10 rounded-full mr-2"
        />
        <span className="font-bold">{post.user.username}</span>
      </div>
      <p className="mb-4">{post.caption}</p>
      <h3 className="font-bold">Comments:</h3>
      <ul className="space-y-2">
        {post.comments.map((comment) => (
          <li key={comment.id} className="flex items-center">
            <img
              src={comment.user.profilePictureUrl}
              alt={comment.user.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span>
              <strong>{comment.user.username}</strong>: {comment.comment}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostPage;
