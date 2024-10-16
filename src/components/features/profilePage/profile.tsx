import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  getPostsByUserId,
  getFollowersByUserId,
  getFollowingByUserId,
} from "@/api/api";
import { useRouter } from "next/router";
import FollowerPopup from "./followerPopup";
import FollowingPopup from "./followingPopup";

interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  isLike: boolean;
  totalLikes: number;
  user: {
    id: string;
    username: string;
    email: string;
    profilePictureUrl: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  phoneNumber: string;
  bio: string;
  website: string;
  totalFollowing: number;
  totalFollowers: number;
}

interface Follower {
  id: string;
  username: string;
  profilePictureUrl: string;
  // Add other fields if necessary
}

interface Following {
  id: string;
  username: string;
  profilePictureUrl: string;
  // Add other fields if necessary
}

const Profile = () => {
  const router = useRouter();
  const { id: userId } = router.query;

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Following[]>([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userResponse, postsResponse] = await Promise.all([
          getUserProfile(userId as string),
          getPostsByUserId(userId as string),
        ]);
        setUser(userResponse.data.data);
        setPosts(postsResponse.data.data.posts);
      } catch (error: any) {
        setError(error.message || "Error fetching data");
      }
    };

    fetchData();
  }, [userId]);

  const handleViewFollowers = async () => {
    try {
      const response = await getFollowersByUserId(userId as string);
      setFollowers(response.data.data.users);
      setIsFollowersModalOpen(true);
    } catch (error: any) {
      setError(error.message || "Error fetching followers");
    }
  };

  const handleViewFollowing = async () => {
    try {
      const response = await getFollowingByUserId(userId as string);
      setFollowing(response.data.data.users);
      setIsFollowingModalOpen(true);
    } catch (error: any) {
      setError(error.message || "Error fetching following");
    }
  };

  const closeModal = () => {
    setIsFollowersModalOpen(false);
    setIsFollowingModalOpen(false);
  };

  const handlePostClick = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center mb-8">
        <img
          src={user.profilePictureUrl}
          alt={user.username}
          className="w-24 h-24 rounded-full"
        />
        <h1 className="text-2xl font-bold">{user.username}</h1>
        <p className="text-white">{user.bio}</p>
        <div className="grid grid-cols-3 gap-5 mt-4">
          <p className="flex flex-col items-center">
            <strong>Posts</strong>
            <strong>{posts.length}</strong>
          </p>
          <p
            className="flex flex-col items-center cursor-pointer"
            onClick={handleViewFollowers} // Directly call function
          >
            <strong>Followers</strong>
            <strong>{user.totalFollowers}</strong>
          </p>
          <p
            className="flex flex-col items-center cursor-pointer"
            onClick={handleViewFollowing} // Directly call function
          >
            <strong>Following</strong>
            <strong>{user.totalFollowing}</strong>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center items-center">
        {posts.map((post) => (
          <div key={post.id} className="w-full p-2 flex flex-col items-center">
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="object-cover w-full h-40 rounded-md cursor-pointer"
              onClick={() => handlePostClick(post.id)}
            />
          </div>
        ))}
      </div>
      {isFollowersModalOpen && (
        <FollowerPopup followers={followers} onClose={closeModal} />
      )}
      {isFollowingModalOpen && (
        <FollowingPopup following={following} onClose={closeModal} />
      )}
    </div>
  );
};

export default Profile;
