// src/pages/SharedPostView.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegHeart, FaHeart, FaRegComment, FaShare, FaArrowLeft } from "react-icons/fa6";
import { getPostBySharedId, likePost, addComment } from "../services";

// Add theme detection hook
const useThemeDetection = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initial theme check
    const isLightMode = document.body.classList.contains("light");
    setIsDarkMode(!isLightMode);

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(!document.body.classList.contains("light"));
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return isDarkMode;
};

const SharedPostView = () => {
  const { shareId } = useParams();
  const isDarkMode = useThemeDetection();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getPostBySharedId(shareId);

        if (response.error) {
          setError(response.error);
        } else if (response._id) {
          setPost(response);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching shared post:", err);
        setError("Failed to load post. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchPost();
    }
  }, [shareId]);

  const handleLike = async () => {
    if (!localStorage.getItem("token")) {
      setError("Please sign in to like posts");
      return;
    }

    try {
      const response = await likePost(post._id);
      if (response.error) {
        setError(response.error);
      } else {
        setPost(response.post);
      }
    } catch (err) {
      setError("Failed to like post. Please try again.");
    }
  };

  const submitComment = async () => {
    if (!localStorage.getItem("token")) {
      setError("Please sign in to comment");
      return;
    }

    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      const response = await addComment(post._id, commentText);
      if (response.error) {
        setError(response.error);
      } else {
        setPost(response.post);
        setCommentText("");
        setShowCommentForm(false);
      }
    } catch (err) {
      setError("Failed to add comment. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className={`${isDarkMode ? "text-white/60" : "text-slate-500"}`}>Loading shared post...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div
            className={`p-6 rounded-lg ${
              isDarkMode ? "bg-slate-800/50 border-white/10" : "bg-white border-slate-200"
            } border`}
          >
            <h2 className="text-xl font-bold mb-2">Post Not Found</h2>
            <p className={`mb-4 ${isDarkMode ? "text-white/60" : "text-slate-500"}`}>{error}</p>
            <Link
              to="/community"
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white"
            >
              Go to Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show post view
  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div
            className={`p-6 rounded-lg ${
              isDarkMode ? "bg-slate-800/50 border-white/10" : "bg-white border-slate-200"
            } border`}
          >
            <h2 className="text-xl font-bold mb-2">Post Not Found</h2>
            <p className={`mb-4 ${isDarkMode ? "text-white/60" : "text-slate-500"}`}>
              We couldn't find the post you're looking for.
            </p>
            <Link
              to="/community"
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white"
            >
              Go to Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80"
          : "bg-gradient-to-b from-white via-slate-50 to-indigo-50/80"
      } pt-20 pb-16 px-4`}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            to="/community"
            className={`inline-flex items-center gap-2 ${
              isDarkMode ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-800"
            } transition-colors`}
          >
            <FaArrowLeft /> Back to Community
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            isDarkMode ? "bg-slate-800/50 border-white/10" : "bg-white border-slate-200"
          } rounded-2xl p-6 border backdrop-blur-sm`}
        >
          {/* Post content */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}`}
              alt={post.author.name}
              className={`w-12 h-12 rounded-full border-2 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}
            />
            <div>
              <h3 className="font-semibold">{post.author.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className={`${isDarkMode ? "text-white/40" : "text-slate-500"}`}>
                  {post.author.role || "Member"}
                </span>
                <span className={`${isDarkMode ? "text-white/40" : "text-slate-500"}`}>•</span>
                <span className={`${isDarkMode ? "text-white/40" : "text-slate-500"}`}>
                  {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
            {post.category && (
              <span
                className={`ml-auto text-sm px-3 py-1 rounded-full ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
                } border`}
              >
                {post.category}
              </span>
            )}
          </div>

          <p className={`${isDarkMode ? "text-white/80" : "text-slate-700"} mb-4 leading-relaxed`}>{post.content}</p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full h-auto max-h-96 object-contain rounded-xl mb-4"
            />
          )}

          {/* Interactions */}
          <div
            className={`flex gap-6 ${isDarkMode ? "text-white/60" : "text-slate-600"} border-t ${
              isDarkMode ? "border-white/10" : "border-slate-200"
            } pt-4`}
          >
            <motion.button
              onClick={handleLike}
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
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="flex items-center gap-2 hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRegComment /> {post.comments ? post.comments.length : 0}
            </motion.button>
            <motion.button
              onClick={() => {
                navigator.share
                  ? navigator.share({
                      title: "Check out this post on ActionConnect",
                      text: "I found this interesting post on ActionConnect",
                      url: window.location.href,
                    })
                  : navigator.clipboard.writeText(window.location.href);
              }}
              className="flex items-center gap-2 hover:text-green-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShare /> Share
            </motion.button>
          </div>

          {/* Comment Form */}
          {showCommentForm && (
            <div className={`mt-4 border-t ${isDarkMode ? "border-white/10" : "border-slate-200"} pt-4`}>
              <div className="flex gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=User`}
                  alt="You"
                  className={`w-8 h-8 rounded-full border ${isDarkMode ? "border-white/10" : "border-slate-200"}`}
                />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className={`w-full ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 placeholder-white/40"
                        : "bg-slate-50 border-slate-300 placeholder-slate-400"
                    } border rounded-lg p-3 text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors text-sm`}
                    rows="2"
                  />
                  <div className="flex justify-end mt-2">
                    <motion.button
                      onClick={submitComment}
                      className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-sm font-medium text-white hover:from-blue-600 hover:to-purple-600"
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

          {/* Comments Section */}
          {post.comments && post.comments.length > 0 && (
            <div className={`mt-4 space-y-3 border-t ${isDarkMode ? "border-white/10" : "border-slate-200"} pt-4`}>
              <h4 className={`text-sm font-medium ${isDarkMode ? "text-white/60" : "text-slate-500"}`}>
                Comments ({post.comments.length})
              </h4>

              {post.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-3">
                  <img
                    src={comment.user.avatar || `https://ui-avatars.com/api/?name=${comment.user.name}`}
                    alt={comment.user.name}
                    className={`w-8 h-8 rounded-full border ${isDarkMode ? "border-white/10" : "border-slate-200"}`}
                  />
                  <div className={`${isDarkMode ? "bg-white/5" : "bg-slate-100"} px-3 py-2 rounded-lg flex-1`}>
                    <div className="text-sm font-medium">{comment.user.name}</div>
                    <p className={`text-sm ${isDarkMode ? "text-white/70" : "text-slate-600"}`}>{comment.content}</p>
                    <div className={`text-xs mt-1 ${isDarkMode ? "text-white/40" : "text-slate-400"}`}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SharedPostView;
