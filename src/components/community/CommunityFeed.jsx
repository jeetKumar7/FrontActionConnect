import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRegHeart, FaHeart, FaRegComment, FaShare, FaImage, FaVideo, FaLink, FaLeaf } from "react-icons/fa6";
import { createPost, likePost, addComment, getPostByShareId, getPosts, uploadImage } from "../../services";

const CommunityFeed = () => {
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setFetchingPosts(true);
        const response = await getPosts();
        if (response.posts) {
          setPosts(response.posts);
        }
      } catch (err) {
        setError("Failed to fetch posts. Please refresh the page.");
      } finally {
        setFetchingPosts(false);
      }
    };

    fetchAllPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();

    if (!newPost.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    // Check if user is authenticated
    if (!localStorage.getItem("token")) {
      setError("Please sign in to create a post");
      return;
    }

    setLoading(true);
    setError("");

    const postData = {
      content: newPost,
      imageUrl,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
    };

    console.log("Submitting post:", postData);

    try {
      const response = await createPost(postData);
      console.log("Post creation response:", response);

      if (response.error) {
        console.error("Server error:", response.error);
        setError(response.error);
      } else if (response.message && response.post) {
        // Success - post created
        setNewPost("");
        setImageUrl("");
        setSuccessMessage(response.message || "Post created successfully!");

        // Add new post to the list with proper formatting
        const newPost = {
          ...response.post,
          author: {
            _id: localStorage.getItem("userId") || response.post.author,
            name: localStorage.getItem("userName") || "User",
          },
          likes: response.post.likes || [],
          comments: response.post.comments || [],
        };

        setPosts((prev) => [newPost, ...prev]);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        // Try to handle even malformed responses
        console.error("Unexpected response format:", response);
        if (response.post) {
          // We have a post but missing something else
          setSuccessMessage("Post created");
          const newPost = {
            ...response.post,
            author: {
              _id: localStorage.getItem("userId") || response.post.author,
              name: localStorage.getItem("userName") || "User",
            },
            likes: response.post.likes || [],
            comments: response.post.comments || [],
          };
          setPosts((prev) => [newPost, ...prev]);
        } else {
          setError("Unexpected server response. Please try again.");
        }
      }
    } catch (err) {
      console.error("Post creation error:", err);
      setError(`Failed to create post: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    // Check if user is authenticated
    if (!localStorage.getItem("token")) {
      setError("Please sign in to like posts");
      return;
    }

    try {
      const response = await likePost(postId);
      if (response.error) {
        setError(response.error);
      } else {
        // Update post in the list
        setPosts((prev) => prev.map((post) => (post._id === postId ? response.post : post)));
      }
    } catch (err) {
      setError("Failed to like post. Please try again.");
    }
  };

  const handleComment = async (postId) => {
    // Toggle comment form
    setActiveCommentId(activeCommentId === postId ? null : postId);
  };

  const submitComment = async (postId) => {
    // Check if user is authenticated
    if (!localStorage.getItem("token")) {
      setError("Please sign in to comment");
      return;
    }

    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      const response = await addComment(postId, commentText);
      if (response.error) {
        setError(response.error);
      } else {
        // Update post in the list
        setPosts((prev) => prev.map((post) => (post._id === postId ? response.post : post)));
        setCommentText("");
        setActiveCommentId(null);
      }
    } catch (err) {
      setError("Failed to add comment. Please try again.");
    }
  };

  const handleShare = async (postId) => {
    try {
      const post = await getPostByShareId(postId);
      const shareUrl = `${window.location.origin}/post/${post.shareId}`;
      await navigator.clipboard.writeText(shareUrl);
      setSuccessMessage("Link copied to clipboard!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError("Failed to share post. Please try again.");
    }
  };

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size - limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.match("image.*")) {
        setError("Please select an image file");
        return;
      }

      setImageLoading(true);
      setError("");

      try {
        // Show a preview immediately for better UX
        const reader = new FileReader();
        reader.onload = (event) => {
          // This is just a temporary preview, will be replaced with the Cloudinary URL
          setImageUrl(event.target.result);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        const response = await uploadImage(file);

        if (response.error) {
          setError(response.error);
          setImageUrl(""); // Clear the preview on error
        } else {
          // Set the actual Cloudinary URL
          setImageUrl(response.imageUrl);
          setSuccessMessage("Image uploaded successfully!");

          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        }
      } catch (err) {
        console.error("Image upload error:", err);
        setError("Failed to upload image. Please try again.");
        setImageUrl(""); // Clear the preview on error
      } finally {
        setImageLoading(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg text-sm mb-4">
          {successMessage}
        </div>
      )}

      {/* Create Post */}
      <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-white/10 backdrop-blur-sm">
        <form onSubmit={handlePost}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <FaLeaf className="w-6 h-6 text-white" />
            </div>
            <select
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                // Override browser default styling
                color: "white",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="all" style={{ backgroundColor: "#1e293b", color: "white" }}>
                Select Category
              </option>
              <option value="climate" style={{ backgroundColor: "#1e293b", color: "white" }}>
                Climate Action
              </option>
              <option value="ocean" style={{ backgroundColor: "#1e293b", color: "white" }}>
                Ocean Conservation
              </option>
              <option value="wildlife" style={{ backgroundColor: "#1e293b", color: "white" }}>
                Wildlife Protection
              </option>
            </select>
          </div>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your environmental initiatives and ideas..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors mb-4"
            rows="3"
          />

          {imageUrl && (
            <div className="relative mb-4">
              <img
                src={imageUrl}
                alt="Preview"
                className={`w-full h-64 object-cover rounded-xl ${imageLoading ? "opacity-50" : ""}`}
              />
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white"
                disabled={imageLoading}
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex gap-4">
              <label
                className={`p-2 rounded-lg ${
                  imageLoading
                    ? "bg-white/5 text-white/30 cursor-wait"
                    : "hover:bg-white/5 text-white/60 hover:text-white cursor-pointer"
                } transition-colors`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={imageLoading}
                />
                {imageLoading ? (
                  <div className="w-5 h-5 animate-pulse">
                    <FaImage className="w-5 h-5" />
                  </div>
                ) : (
                  <FaImage className="w-5 h-5" />
                )}
              </label>
              {/* <button
                type="button"
                className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
              >
                <FaVideo className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
              >
                <FaLink className="w-5 h-5" />
              </button> */}
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              whileHover={loading ? {} : { scale: 1.05 }}
              whileTap={loading ? {} : { scale: 0.95 }}
            >
              {loading ? "Posting..." : "Share Post"}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {fetchingPosts ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-white/60">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-white/5">
            <FaLeaf className="mx-auto text-4xl text-white/20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-white/60">Be the first to share something with the community!</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
            >
              {/* Post content */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}`}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full border-2 border-white/10"
                />
                <div>
                  <h3 className="font-semibold">{post.author.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/40">{post.author.role || "Member"}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/40">
                      {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <span className="ml-auto text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {post.category || "General"}
                </span>
              </div>

              <p className="text-white/80 mb-4 leading-relaxed">{post.content}</p>
              {post.imageUrl && (
                <img src={post.imageUrl} alt="Post content" className="w-full h-64 object-cover rounded-xl mb-4" />
              )}

              {/* Interactions */}
              <div className="flex gap-6 text-white/60 border-t border-white/10 pt-4">
                <motion.button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {post.likes && post.likes.includes(localStorage.getItem("userId")) ? (
                    <FaHeart className="text-blue-400" />
                  ) : (
                    <FaRegHeart />
                  )}
                  {post.likes ? post.likes.length : 0}
                </motion.button>
                <motion.button
                  onClick={() => handleComment(post._id)}
                  className="flex items-center gap-2 hover:text-purple-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRegComment /> {post.comments ? post.comments.length : 0}
                </motion.button>
                <motion.button
                  onClick={() => handleShare(post._id)}
                  className="flex items-center gap-2 hover:text-green-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShare /> Share
                </motion.button>
              </div>

              {/* Comments Section */}
              {post.comments && post.comments.length > 0 && (
                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  <h4 className="text-sm font-medium text-white/60">Comments</h4>
                  {post.comments.slice(0, 3).map((comment, idx) => (
                    <div key={idx} className="flex gap-3">
                      <img
                        src={comment.user.avatar || `https://ui-avatars.com/api/?name=${comment.user.name}`}
                        alt={comment.user.name}
                        className="w-8 h-8 rounded-full border border-white/10"
                      />
                      <div className="bg-white/5 px-3 py-2 rounded-lg flex-1">
                        <div className="text-sm font-medium">{comment.user.name}</div>
                        <p className="text-sm text-white/70">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {post.comments.length > 3 && (
                    <button className="text-sm text-blue-400 hover:text-blue-300">
                      View all {post.comments.length} comments
                    </button>
                  )}
                </div>
              )}

              {/* Comment Form */}
              {activeCommentId === post._id && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="flex gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=User`}
                      alt="You"
                      className="w-8 h-8 rounded-full border border-white/10"
                    />
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                        rows="2"
                      />
                      <div className="flex justify-end mt-2">
                        <motion.button
                          onClick={() => submitComment(post._id)}
                          className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Comment
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
