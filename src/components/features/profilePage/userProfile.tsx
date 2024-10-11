import React, { useEffect, useState } from "react";
import {
  getLoggedUser,
  getPostsByUserId,
  getFollowersByUserId,
  getFollowingByUserId,
} from "@/api/api";
import FollowerPopup from "./followerPopup";
import FollowingPopup from "./followingPopup";
import { useRouter } from "next/router";

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
}

interface Following {
  id: string;
  username: string;
  profilePictureUrl: string;
}

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Following[]>([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getLoggedUser();
        if (userResponse.data.code === "200") {
          const loggedUser = userResponse.data.data;
          setUser(loggedUser);

          const postsResponse = await getPostsByUserId(loggedUser.id);
          if (postsResponse.data.code === "200") {
            setPosts(postsResponse.data.data.posts);
          } else {
            setError(postsResponse.data.message);
          }
        } else {
          setError(userResponse.data.message);
        }
      } catch (error: any) {
        setError(error.message || "Error fetching data");
      }
    };

    fetchData();
  }, []);

  const handleViewFollowers = async () => {
    if (!user) return;

    try {
      const response = await getFollowersByUserId(user.id);
      if (response.data.code === "200") {
        setFollowers(response.data.data.users);
        setIsFollowersModalOpen(true);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.message || "Error fetching followers");
    }
  };

  const handleViewFollowing = async () => {
    if (!user) return;

    try {
      const response = await getFollowingByUserId(user.id);
      if (response.data.code === "200") {
        setFollowing(response.data.data.users);
        setIsFollowingModalOpen(true);
      } else {
        setError(response.data.message);
      }
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
    <div className="bg-white flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center mb-8">
        <img
          src={user.profilePictureUrl}
          alt={user.username}
          className="w-24 h-24 rounded-full"
        />
        <h1 className="text-2xl font-bold text-black">{user.username}</h1>
        <p className="text-black">{user.bio}</p>
        <div className="grid grid-cols-3 gap-5 mt-4">
          <p className="flex flex-col items-center text-black">
            <strong>Posts</strong>
            <strong>{posts.length}</strong>
          </p>
          <p
            className="flex flex-col items-center cursor-pointer text-black"
            onClick={handleViewFollowers}
          >
            <strong>Followers</strong>
            <strong>{user.totalFollowers}</strong>
          </p>
          <p
            className="flex flex-col items-center cursor-pointer text-black"
            onClick={handleViewFollowing}
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
