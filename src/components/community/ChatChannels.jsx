import React, { useState, useEffect, useRef } from "react";
import {
  FaHashtag,
  FaPaperPlane,
  FaLeaf,
  FaSun,
  FaWater,
  FaRecycle,
  FaTree,
  FaTrash,
  FaEdit,
  FaSpinner,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import {
  createMessage,
  getChannelMessages,
  deleteMessage,
  updateMessage,
  getAllChannels,
  createChannel,
  getUserProfile,
} from "../../services";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ChatChannels = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState("All Channels");
  const [loading, setLoading] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [error, setError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const messagesEndRef = useRef(null);

  // New state for channels
  const [channels, setChannels] = useState([]);
  const [fetchingChannels, setFetchingChannels] = useState(true);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelData, setNewChannelData] = useState({ name: "", description: "" });

  // New state for auto-scroll
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesContainerRef = useRef(null);

  // Socket.io ref
  const socketRef = useRef(null);
  const [usersTyping, setUsersTyping] = useState({});
  const typingTimeoutRef = useRef(null);

  // New state for current user
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Initialize socket connection with auth token
    socketRef.current = io(BACKEND_URL, {
      auth: {
        token,
      },
    });

    // Socket event listeners
    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketRef.current.on("error", (message) => {
      setError(`Socket error: ${message}`);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setError(`Connection error: ${err.message}`);
    });

    // Update socket message handler
    socketRef.current.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => {
        // Check for duplicates
        if (prevMessages.some((msg) => msg._id === newMessage.messageId)) {
          return prevMessages;
        }

        // Format message with guaranteed sender info
        const formattedMessage = {
          _id: newMessage.messageId,
          content: newMessage.content,
          sender: {
            _id: newMessage.sender._id,
            name:
              newMessage.sender.name ||
              (newMessage.sender._id === localStorage.getItem("userId")
                ? localStorage.getItem("userName")
                : "Unknown User"),
            email: newMessage.sender.email,
          },
          channel: newMessage.channelId,
          createdAt: newMessage.createdAt,
        };

        return [formattedMessage, ...prevMessages];
      });
    });

    socketRef.current.on("userTyping", (userId) => {
      setUsersTyping((prev) => ({
        ...prev,
        [userId]: true,
      }));
    });

    socketRef.current.on("userStoppedTyping", (userId) => {
      setUsersTyping((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    });

    socketRef.current.on("userJoined", (userId) => {
      console.log(`User ${userId} joined the channel`);
      // You could show a notification or update UI
    });

    // Clean up connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await getUserProfile();
      if (!response.error) {
        setCurrentUser(response.user);
      }
    };

    fetchUserProfile();
  }, []);

  // Join socket room when channel changes
  useEffect(() => {
    if (!socketRef.current || !selectedChannel) return;

    // Join the new channel room
    socketRef.current.emit("joinChannel", selectedChannel);

    // Leave previous channels when joining a new one
    return () => {
      if (socketRef.current && selectedChannel) {
        socketRef.current.emit("leaveChannel", selectedChannel);
      }
    };
  }, [selectedChannel]);

  // Fetch channels on component mount
  useEffect(() => {
    const fetchChannels = async () => {
      setFetchingChannels(true);
      try {
        const response = await getAllChannels();
        if (Array.isArray(response) && response.length > 0) {
          // Transform the API response to match our format
          const formattedChannels = formatChannels(response);
          setChannels(formattedChannels);

          // Select the first channel by default if none is selected
          if (!selectedChannel) {
            setSelectedChannel(response[0]._id);
          }
        } else if (Array.isArray(response) && response.length === 0) {
          // No channels exist yet
          setChannels([{ category: "All Channels", channels: [] }]);
        } else if (response.error) {
          setError(response.error);
          setChannels([{ category: "All Channels", channels: [] }]);
        }
      } catch (err) {
        console.error("Error fetching channels:", err);
        setError("Failed to fetch channels");
        setChannels([{ category: "All Channels", channels: [] }]);
      } finally {
        setFetchingChannels(false);
      }
    };

    fetchChannels();
  }, []);

  // Helper function to format channels from API to our structure
  const formatChannels = (apiChannels) => {
    // Group channels by category - for now we'll put them all in "All Channels"
    return [
      {
        category: "All Channels",
        channels: apiChannels.map((channel) => ({
          id: channel._id,
          name: channel.name,
          description: channel.description,
          members: channel.members,
          icon: FaHashtag, // default icon
        })),
      },
    ];
  };

  // Handler for creating a new channel
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelData.name.trim()) {
      setError("Channel name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const response = await createChannel(newChannelData);
      if (response.error) {
        setError(response.error);
      } else {
        // Add the new channel to our state
        const newFormattedChannel = {
          id: response.channel._id,
          name: response.channel.name,
          description: response.channel.description,
          members: response.channel.members,
          icon: FaHashtag,
        };

        // Update the channels state by adding to "All Channels" category
        setChannels((prev) => {
          const newChannels = [...prev];
          const allChannelsIndex = newChannels.findIndex((cat) => cat.category === "All Channels");

          if (allChannelsIndex !== -1) {
            newChannels[allChannelsIndex].channels.push(newFormattedChannel);
          } else {
            // Create "All Channels" category if it doesn't exist
            newChannels.unshift({
              category: "All Channels",
              channels: [newFormattedChannel],
            });
          }

          return newChannels;
        });

        // Reset form and hide it
        setNewChannelData({ name: "", description: "" });
        setShowCreateChannel(false);

        // Select the new channel
        setSelectedChannel(response.channel._id);
      }
    } catch (err) {
      setError("Failed to create channel. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  // // Handler for joining a channel
  // const handleJoinChannel = async (channelId) => {
  //   try {
  //     const response = await joinChannel(channelId);
  //     if (response.error) {
  //       setError(response.error);
  //     } else {
  //       // Update channels to reflect membership
  //       setChannels((prev) => {
  //         const newChannels = [...prev];

  //         // Find the channel and update its members
  //         for (let category of newChannels) {
  //           const channelIndex = category.channels.findIndex((c) => c.id === channelId);
  //           if (channelIndex !== -1) {
  //             const userId = localStorage.getItem("userId");
  //             if (!category.channels[channelIndex].members.includes(userId)) {
  //               category.channels[channelIndex].members.push(userId);
  //             }
  //             break;
  //           }
  //         }

  //         return newChannels;
  //       });
  //     }
  //   } catch (err) {
  //     setError("Failed to join channel. Please try again.");
  //   }
  // };

  // Handler for leaving a channel
  // const handleLeaveChannel = async (channelId) => {
  //   try {
  //     const response = await leaveChannel(channelId);
  //     if (response.error) {
  //       setError(response.error);
  //     } else {
  //       // Update channels to reflect membership
  //       setChannels((prev) => {
  //         const newChannels = [...prev];

  //         // Find the channel and update its members
  //         for (let category of newChannels) {
  //           const channelIndex = category.channels.findIndex((c) => c.id === channelId);
  //           if (channelIndex !== -1) {
  //             const userId = localStorage.getItem("userId");
  //             category.channels[channelIndex].members = category.channels[channelIndex].members.filter(
  //               (id) => id !== userId
  //             );
  //             break;
  //           }
  //         }

  //         return newChannels;
  //       });

  //       // If we left the currently selected channel, select another one
  //       if (selectedChannel === channelId) {
  //         const firstChannel = channels[0]?.channels[0];
  //         if (firstChannel) {
  //           setSelectedChannel(firstChannel.id);
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     setError("Failed to leave channel. Please try again.");
  //   }
  // };

  // Update message fetching to only run when we have a selected channel
  useEffect(() => {
    if (!selectedChannel) return;

    // Fetch initial messages from the API
    const fetchMessages = async () => {
      setFetchingMessages(true);
      setError("");

      try {
        const response = await getChannelMessages(selectedChannel);

        if (response.error) {
          setError(`Error: ${response.error}`);
          setMessages([]); // Set empty messages on error
        } else {
          setMessages(response);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Server error. The channel might be unavailable or you may need to rejoin.");
        setMessages([]); // Set empty messages on error
      } finally {
        setFetchingMessages(false);
      }
    };

    fetchMessages();

    // We don't need polling anymore since we're using Socket.IO
    // The interval can be removed

    return () => {
      // No need to clean up interval
    };
  }, [selectedChannel]);

  // Only auto-scroll when appropriate
  useEffect(() => {
    // Only scroll if:
    // 1. Auto-scroll is enabled
    // 2. We have messages
    // 3. A new message was added (not when loading initial messages)
    if (shouldAutoScroll && messages.length > 0 && !fetchingMessages) {
      // Use a small delay to ensure the container has stabilized
      const timer = setTimeout(() => {
        // Instead of scrollIntoView, directly scroll the container
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTop = 0; // Scroll to top (since we're using flex-col-reverse)
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, fetchingMessages, shouldAutoScroll]);

  // Add this to detect when user manually scrolls
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Check if user has scrolled up by a significant amount
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      // Only change the auto-scroll setting if it would change
      if (shouldAutoScroll !== isNearBottom) {
        setShouldAutoScroll(isNearBottom);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [shouldAutoScroll]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!socketRef.current || !selectedChannel) return;

    socketRef.current.emit("typing", selectedChannel);

    // Clear previous timeout
    clearTimeout(typingTimeoutRef.current);
  };

  // Simplify handleSendMessage
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError("");

    try {
      if (socketRef.current?.connected) {
        // Only send content and channelId - user info comes from JWT
        socketRef.current.emit("sendMessage", {
          content: message,
          channelId: selectedChannel,
        });
        setMessage("");
      } else {
        // Fallback to REST API
        const response = await createMessage({
          content: message,
          channelId: selectedChannel,
        });

        if (response.error) {
          setError(response.error);
        } else {
          setMessage("");
        }
      }
    } catch (err) {
      setError("Failed to send message. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a typing indicator in the input field
  const handleMessageInputChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  const handleDeleteMessage = async (messageId) => {
    // Check if user is authenticated
    if (!localStorage.getItem("token")) {
      setError("Please sign in to delete messages");
      return;
    }

    // Check if this is a temporary ID (optimistic message)
    if (messageId.toString().length > 24 || !messageId.match(/^[0-9a-fA-F]{24}$/)) {
      // Just remove it from the UI since it's an optimistic message
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      return;
    }

    try {
      const response = await deleteMessage(messageId);

      if (response.error) {
        setError(response.error);
      } else {
        // Remove message from the list
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      }
    } catch (err) {
      setError("Failed to delete message. Please try again.", err);
    }
  };

  const handleEditMessage = async (messageId) => {
    if (editingMessageId === messageId) {
      // Submit the edit
      try {
        const response = await updateMessage(messageId, editMessage);

        if (response.error) {
          setError(response.error);
        } else {
          // Update message in the list
          setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, content: editMessage } : msg)));
          setEditingMessageId(null);
          setEditMessage("");
        }
      } catch (err) {
        setError("Failed to update message. Please try again.", err);
      }
    } else {
      // Start editing
      const message = messages.find((msg) => msg._id === messageId);
      if (message) {
        setEditingMessageId(messageId);
        setEditMessage(message.content);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] pt-8 pb-8 px-4">
      {error && (
        <div className="max-w-7xl mx-auto mb-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-[280px_1fr] h-[calc(100vh-8rem)] overflow-hidden">
          {/* Channels Sidebar */}
          <div className="border-r border-white/10 overflow-y-auto scrollbar-none h-full">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl font-bold">Channels</h2>
                <motion.button
                  onClick={() => setShowCreateChannel(!showCreateChannel)}
                  className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaPlus className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Create Channel Form */}
              <AnimatePresence>
                {showCreateChannel && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-6 overflow-hidden"
                    onSubmit={handleCreateChannel}
                  >
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h3 className="text-sm font-semibold mb-3">Create New Channel</h3>
                      <div className="space-y-3 mb-4">
                        <input
                          type="text"
                          placeholder="Channel name"
                          value={newChannelData.name}
                          onChange={(e) => setNewChannelData({ ...newChannelData, name: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                        />
                        <textarea
                          placeholder="Description (optional)"
                          value={newChannelData.description}
                          onChange={(e) => setNewChannelData({ ...newChannelData, description: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 resize-none"
                          rows="2"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCreateChannel(false)}
                          className="px-3 py-1.5 text-white/60 hover:text-white text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm"
                          disabled={loading}
                        >
                          {loading ? <FaSpinner className="animate-spin" /> : "Create"}
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Channel List */}
              {fetchingChannels ? (
                <div className="flex justify-center py-4">
                  <FaSpinner className="animate-spin text-white/40" />
                </div>
              ) : (
                <nav className="space-y-6">
                  {channels.map((category) => (
                    <div key={category.category}>
                      <button
                        onClick={() => setExpandedCategory(category.category)}
                        className="flex items-center gap-2 px-2 py-1 w-full text-left font-semibold text-white/60 hover:text-white"
                      >
                        <span>{category.category}</span>
                      </button>
                      <AnimatePresence>
                        {expandedCategory === category.category && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 mt-2">
                              {category.channels.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-white/40">
                                  No channels yet. Create one to get started!
                                </div>
                              ) : (
                                category.channels.map((channel) => (
                                  <div key={channel.id} className="group">
                                    <motion.button
                                      onClick={() => setSelectedChannel(channel.id)}
                                      className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition-all ${
                                        selectedChannel === channel.id
                                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
                                          : "text-white/60 hover:bg-white/5 hover:text-white"
                                      }`}
                                      whileHover={{ x: 4 }}
                                    >
                                      <channel.icon className="w-4 h-4" />
                                      <span>{channel.name}</span>
                                    </motion.button>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </nav>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col bg-slate-900/30 h-full overflow-hidden">
            {/* Chat Header */}
            {selectedChannel ? (
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <FaHashtag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {channels.flatMap((cat) => cat.channels).find((c) => c.id === selectedChannel)?.name || "Channel"}
                    </h3>
                    <p className="text-sm text-white/40">
                      {channels.find((cat) => cat.channels.some((c) => c.id === selectedChannel))?.category ||
                        "Channel"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center px-6 py-4 border-b border-white/10 text-white/40">
                Select a channel or create a new one to start chatting
              </div>
            )}

            {/* Messages */}
            {selectedChannel ? (
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse"
                style={{ height: "calc(100% - 128px)" }} // Subtract header and input heights
              >
                <div ref={messagesEndRef} />

                {fetchingMessages ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p className="text-white/60">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/40">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg._id} className="flex gap-4 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-lg font-bold">
                          {msg.sender?.name?.charAt(0) || "U"}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{msg.sender?.name || "Unknown User"}</span>
                          <span className="text-sm text-white/40">{new Date(msg.createdAt).toLocaleTimeString()}</span>

                          {/* Only show edit/delete for the user's own messages */}
                          {msg.sender?._id === localStorage.getItem("userId") && (
                            <div className="ml-auto flex gap-2">
                              <button
                                onClick={() => handleEditMessage(msg._id)}
                                className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/5"
                              >
                                <FaEdit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                className="text-white/40 hover:text-red-400 p-1 rounded-full hover:bg-white/5"
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {editingMessageId === msg._id ? (
                          <div className="bg-white/10 rounded-lg p-2">
                            <textarea
                              value={editMessage}
                              onChange={(e) => setEditMessage(e.target.value)}
                              className="w-full bg-transparent border-none focus:outline-none text-white resize-none"
                              rows="2"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="px-2 py-1 text-xs text-white/60 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditMessage(msg._id)}
                                className="px-2 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-white/80 bg-white/5 rounded-lg px-4 py-2">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/40">
                <div className="text-center">
                  <FaHashtag className="text-4xl mx-auto mb-4 text-white/20" />
                  <h3 className="text-xl font-medium mb-1">Welcome to Channels</h3>
                  <p>Create or select a channel to start chatting</p>
                </div>
              </div>
            )}

            {/* Message Input */}
            {selectedChannel && (
              <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-white/10">
                {/* Show typing indicators */}
                {Object.keys(usersTyping).length > 0 && (
                  <div className="text-xs text-blue-400 mb-1 animate-pulse">Someone is typing...</div>
                )}

                <div className="flex gap-4">
                  <input
                    type="text"
                    value={message}
                    onChange={handleMessageInputChange}
                    placeholder={`Message #${
                      channels.flatMap((cat) => cat.channels).find((c) => c.id === selectedChannel)?.name || "channel"
                    }`}
                    className="flex-1 bg-white/5 rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                    disabled={loading}
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all ${
                      loading ? "opacity-70" : ""
                    }`}
                  >
                    {loading ? <FaSpinner className="w-5 h-5 animate-spin" /> : <FaPaperPlane className="w-5 h-5" />}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatChannels;
