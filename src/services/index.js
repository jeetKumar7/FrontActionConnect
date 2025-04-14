const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import "leaflet/dist/leaflet.css";

// Existing auth services
export const register = async (data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.status === 200 || response.status === 400) {
    return response.json();
  }
  throw new Error("Something went wrong!");
};

export const login = async (data) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    // Log the full response for debugging
    console.log("Login response:", responseData);

    if (response.status >= 200 && response.status < 300) {
      // Add null check for user object and name
      if (responseData.user && responseData.user.name) {
        localStorage.setItem("userName", responseData.user.name);
      }
      return responseData;
    } else {
      // Error case, but still return the response with error flag
      return {
        error: responseData.message || responseData.error || "Authentication failed",
        details: responseData,
      };
    }
  } catch (err) {
    console.error("Login service error:", err);
    return {
      error: "Network or server error. Please try again.",
      details: err.message,
    };
  }
};
// Post services
export const createPost = async (data) => {
  try {
    // Log token for debugging
    const token = localStorage.getItem("token");
    console.log("Token being used:", token?.substring(0, 15) + "...");

    const response = await fetch(`${BACKEND_URL}/api/posts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Send token without the "Bearer " prefix
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("Create post API response:", responseData);

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Server error occurred",
        details: responseData.error,
      };
    }
  } catch (err) {
    console.error("Service error:", err);
    return { error: "Network or parsing error" };
  }
};

export const likePost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    return await response.json();
  } catch (err) {
    console.error("Like post error:", err);
    return { error: "Failed to like post" };
  }
};

export const addComment = async (postId, content) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ content }),
    });

    return await response.json();
  } catch (err) {
    console.error("Add comment error:", err);
    return { error: "Failed to add comment" };
  }
};

export const getPostByShareId = async (shareId) => {
  const response = await fetch(`${BACKEND_URL}/api/posts/share/${shareId}`);
  if (response.status === 200 || response.status === 400) {
    return response.json();
  }
  throw new Error("Something went wrong!");
};

// Add function to get all posts for feed
export const getPosts = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BACKEND_URL}/api/posts`, {
    headers: {
      Authorization: token,
    },
  });
  if (response.status === 200 || response.status === 400) {
    return response.json();
  }
  throw new Error("Something went wrong!");
};

export const uploadImage = async (file) => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "action_connect_unsigned"); // Replace with your Cloudinary upload preset
    formData.append("folder", "actionconnect_posts");

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dak1w5wyf/image/upload`, // Replace YOUR_CLOUD_NAME with your actual Cloudinary cloud name
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      return { imageUrl: data.secure_url };
    } else {
      return { error: "Failed to upload image" };
    }
  } catch (err) {
    console.error("Image upload error:", err);
    return { error: "Failed to upload image. Please try again." };
  }
};

// Add these chat-related services

// Create a new message
export const createMessage = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/messages/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Server error occurred",
        details: responseData.error,
      };
    }
  } catch (err) {
    console.error("Create message error:", err);
    return { error: "Failed to send message" };
  }
};

// Get messages for a specific channel
export const getChannelMessages = async (channelId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/messages/channel/${channelId}`, {
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Server error occurred",
      };
    }
  } catch (err) {
    console.error("Get channel messages error:", err);
    return { error: "Failed to fetch messages" };
  }
};

// Get all messages for a channel
export const getAllChannelMessages = async (channelId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/messages/channel/${channelId}/all`, {
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Server error occurred",
      };
    }
  } catch (err) {
    console.error("Get all channel messages error:", err);
    return { error: "Failed to fetch all messages" };
  }
};

// Delete a message
export const deleteMessage = async (messageId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/messages/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Server error occurred",
      };
    }
  } catch (err) {
    console.error("Delete message error:", err);
    return { error: "Failed to delete message" };
  }
};

// Update a message
export const updateMessage = async (messageId, content) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/messages/${messageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ content }),
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Server error occurred",
      };
    }
  } catch (err) {
    console.error("Update message error:", err);
    return { error: "Failed to update message" };
  }
};

// Add these channel-related services

// Create a new channel
export const createChannel = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/channels/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Server error occurred",
        details: responseData.error,
      };
    }
  } catch (err) {
    console.error("Create channel error:", err);
    return { error: "Failed to create channel" };
  }
};

// Get all channels
export const getAllChannels = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/channels/all`, {
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Server error occurred",
      };
    }
  } catch (err) {
    console.error("Get all channels error:", err);
    return { error: "Failed to fetch channels" };
  }
};

// Join a channel
export const joinChannel = async (channelId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/channels/${channelId}/join`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Server error occurred",
      };
    }
  } catch (err) {
    console.error("Join channel error:", err);
    return { error: "Failed to join channel" };
  }
};

// Leave a channel
export const leaveChannel = async (channelId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/channels/${channelId}/leave`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Server error occurred",
      };
    }
  } catch (err) {
    console.error("Leave channel error:", err);
    return { error: "Failed to leave channel" };
  }
};

// Add these user profile management services

// Get user profile data
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/user/getuser`, {
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Failed to fetch user profile",
      };
    }
  } catch (err) {
    console.error("Get profile error:", err);
    return { error: "Network error fetching profile" };
  }
};

// Update user profile
export const updateUserProfile = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/user/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        location: data.location, // Make sure location is included
      }),
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Failed to update profile",
      };
    }
  } catch (err) {
    console.error("Update profile error:", err);
    return { error: "Network error updating profile" };
  }
};

// Delete user account
export const deleteUserAccount = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/user/delete`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Failed to delete account",
      };
    }
  } catch (err) {
    console.error("Delete account error:", err);
    return { error: "Network error deleting account" };
  }
};

// Get user's supported causes
export const getSupportedCauses = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/user/causes`, {
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData.supportedCauses || [];
    } else {
      return {
        error: responseData.message || "Failed to fetch supported causes",
      };
    }
  } catch (err) {
    console.error("Get supported causes error:", err);
    return { error: "Network error fetching supported causes" };
  }
};

// Add a supported cause
export const addSupportedCause = async (cause) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/user/causes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ cause }),
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Failed to add supported cause",
      };
    }
  } catch (err) {
    console.error("Add supported cause error:", err);
    return { error: "Network error adding supported cause" };
  }
};

// Remove a supported cause
export const removeSupportedCause = async (cause) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/user/causes/${cause}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Failed to remove supported cause",
      };
    }
  } catch (err) {
    console.error("Remove supported cause error:", err);
    return { error: "Network error removing supported cause" };
  }
};

// Get users by supported cause
export const getUsersByCause = async (cause) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/user/by-cause/${cause}`, {
      headers: {
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Failed to fetch users by cause",
      };
    }
  } catch (err) {
    console.error("Get users by cause error:", err);
    return { error: "Network error fetching users by cause" };
  }
};

// Add this function with the other user-related services

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/user/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return { success: true, message: responseData.message };
    } else {
      return {
        success: false,
        error: responseData.message || "Failed to change password",
      };
    }
  } catch (err) {
    console.error("Change password error:", err);
    return { success: false, error: "Network error changing password" };
  }
};

// ActionHub services - Modified to match backend implementation

// Get all organizations - Simplified approach
export const getOrganizations = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");

    // Basic URL without complex query params
    let url = `${BACKEND_URL}/api/actionhub/organizations`;

    // Only add essential parameters as needed
    const params = new URLSearchParams();
    if (filters.category && filters.category !== "all") {
      params.append("category", filters.category);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }
    if (filters.page) {
      params.append("page", filters.page);
    }

    if (filters.createdBy) {
      params.append("createdBy", filters.createdBy);
    }

    // Add query string if any params exist
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log("Fetching organizations from:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: token || "",
      },
    });

    const data = await response.json();

    // Simple standardized response
    return {
      organizations: data.organizations || [],
      pagination: data.pagination
        ? {
            totalItems: data.pagination.total,
            totalPages: data.pagination.pages,
            currentPage: data.pagination.page,
            itemsPerPage: data.pagination.limit,
          }
        : null,
      error: null,
    };
  } catch (err) {
    console.error("Get organizations error:", err);
    return {
      organizations: [],
      pagination: null,
      error: "Failed to fetch organizations",
    };
  }
};

// Get all resources
export const getResources = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams();

    // Changed to match backend's single category field
    if (filters.category && filters.category !== "all") {
      queryParams.append("category", filters.category);
    }

    if (filters.search) {
      queryParams.append("search", filters.search);
    }

    if (filters.page) {
      queryParams.append("page", filters.page);
    }

    if (filters.limit) {
      queryParams.append("limit", filters.limit);
    }
    if (filters.createdBy) {
      queryParams.append("createdBy", filters.createdBy);
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await fetch(`${BACKEND_URL}/api/actionhub/resources${queryString}`, {
      headers: {
        Authorization: token || "",
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      // Adjust pagination fields to match backend structure
      if (responseData.pagination) {
        responseData.pagination = {
          totalItems: responseData.pagination.total,
          totalPages: responseData.pagination.pages,
          currentPage: responseData.pagination.page,
          itemsPerPage: responseData.pagination.limit,
        };
      }
      return responseData;
    } else {
      return {
        error: responseData.message || "Failed to fetch resources",
      };
    }
  } catch (err) {
    console.error("Get resources error:", err);
    return { error: "Network error", resources: [] };
  }
};

// Get all opportunities
export const getOpportunities = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams();

    // Changed to match backend's single category field
    if (filters.category && filters.category !== "all") {
      queryParams.append("category", filters.category);
    }

    if (filters.search) {
      queryParams.append("search", filters.search);
    }

    if (filters.page) {
      queryParams.append("page", filters.page);
    }

    if (filters.createdBy) {
      queryParams.append("createdBy", filters.createdBy);
    }

    if (filters.limit) {
      queryParams.append("limit", filters.limit);
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await fetch(`${BACKEND_URL}/api/actionhub/opportunities${queryString}`, {
      headers: {
        Authorization: token || "",
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      // Adjust pagination fields to match backend structure
      if (responseData.pagination) {
        responseData.pagination = {
          totalItems: responseData.pagination.total,
          totalPages: responseData.pagination.pages,
          currentPage: responseData.pagination.page,
          itemsPerPage: responseData.pagination.limit,
        };
      }
      return responseData;
    } else {
      return {
        error: responseData.message || "Failed to fetch opportunities",
      };
    }
  } catch (err) {
    console.error("Get opportunities error:", err);
    return { error: "Network error", opportunities: [] };
  }
};

// Create a new organization with proper schema mapping
export const createOrganization = async (data) => {
  try {
    const token = localStorage.getItem("token");

    // Map frontend data to match backend schema
    const organizationData = {
      name: data.name,
      description: data.description,
      location: data.location || "Global",
      // Map imageUrl to image as expected by backend schema
      image: data.imageUrl || data.image || "",
      // Use the first category as the main category (backend expects a single string)
      category: data.category || (data.categories && data.categories.length > 0 ? data.categories[0] : "General"),
      // Additional fields will be ignored by the backend
      categories: data.categories || [], // Keep for frontend display purposes
      opportunities: data.opportunities || [],
      rating: data.rating || 0,
      website: data.website || "",
    };

    console.log("Sending organization data to backend:", organizationData);

    const response = await fetch(`${BACKEND_URL}/api/actionhub/organizations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify(organizationData),
    });

    // Log response status for debugging
    console.log("Organization creation response status:", response.status);

    // Get the response content type to check if it's JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      console.log("Organization creation response data:", responseData);

      if (response.status >= 200 && response.status < 300) {
        return responseData;
      } else {
        return {
          error: responseData.message || "Failed to create organization",
        };
      }
    } else {
      // Handle non-JSON response
      const textResponse = await response.text();
      console.error("Non-JSON response:", textResponse.substring(0, 200));
      return {
        error: "Server returned invalid format. Please try again.",
      };
    }
  } catch (err) {
    console.error("Create organization error:", err);
    return { error: `Network error: ${err.message}` };
  }
};

// Create a new resource with proper schema mapping
export const createResource = async (data) => {
  try {
    const token = localStorage.getItem("token");

    // Map frontend data to match backend schema
    const resourceData = {
      title: data.title,
      description: data.description || "",
      type: data.type || "Article",
      provider: data.provider || "",
      url: data.url || "",
      price: data.price || "Free",
      category: data.category || (data.categories && data.categories[0]) || "General",
    };

    console.log("Sending resource data to backend:", resourceData);

    const response = await fetch(`${BACKEND_URL}/api/actionhub/resources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(resourceData),
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || "Failed to create resource",
      };
    }
  } catch (err) {
    console.error("Create resource error:", err);
    return { error: "Network error" };
  }
};

// Create a new opportunity with corrected schema mapping
export const createOpportunity = async (data) => {
  try {
    const token = localStorage.getItem("token");

    // Map frontend data to match backend schema
    const opportunityData = {
      title: data.title,
      description: data.description || "",
      organization: data.organization || "",
      // IMPORTANT: Change applicationUrl to url to match backend schema
      url: data.applicationUrl || "",
      location: data.location || "Remote",
      deadline: data.deadline || null,
      website: data.website || "", // Add website field
      category: data.category || (data.categories && data.categories[0]) || "General",
      // Remove amount field as it's not in the schema
    };

    console.log("Sending opportunity data to backend:", opportunityData);

    const response = await fetch(`${BACKEND_URL}/api/actionhub/opportunities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(opportunityData),
    });

    // Log response status for debugging
    console.log("Opportunity creation response status:", response.status);

    // Add error handling for non-JSON responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      console.log("Opportunity creation response data:", responseData);

      if (response.status >= 200 && response.status < 300) {
        return responseData;
      } else {
        return {
          error: responseData.message || "Failed to create opportunity",
        };
      }
    } else {
      const textResponse = await response.text();
      console.error("Non-JSON response:", textResponse.substring(0, 200));
      return {
        error: "Server returned invalid format. Please try again.",
      };
    }
  } catch (err) {
    console.error("Create opportunity error:", err);
    return { error: `Network error: ${err.message}` };
  }
};

// Get a single item by type and ID
export const getItemById = async (type, id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/actionhub/${type}/${id}`, {
      headers: {
        Authorization: token || "",
      },
    });

    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return responseData;
    } else {
      return {
        error: responseData.message || `Failed to fetch ${type.slice(0, -1)}`,
      };
    }
  } catch (err) {
    console.error("Get item error:", err);
    return { error: "Network error" };
  }
};

// Delete an item by type and ID - Simplified
export const deleteItem = async (type, id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BACKEND_URL}/api/actionhub/${type}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Failed to delete item" };
    }

    return { success: true, message: "Item deleted successfully" };
  } catch (err) {
    console.error("Delete item error:", err);
    return { success: false, error: "Network error" };
  }
};

// Get all initiatives with optional filters
export const getInitiatives = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.tags) queryParams.append("tags", filters.tags.join(","));

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await fetch(`${BACKEND_URL}/api/initiative${queryString}`, {
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return data;
    } else {
      return {
        error: data.message || "Failed to fetch initiatives",
      };
    }
  } catch (err) {
    console.error("Get initiatives error:", err);
    return { error: "Network error fetching initiatives" };
  }
};

// Get single initiative by ID
export const getInitiativeById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/api/initiative/${id}`, {
      headers: {
        Authorization: token || "",
      },
    });

    const data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return data;
    } else {
      return {
        error: data.message || "Failed to fetch initiative",
      };
    }
  } catch (err) {
    console.error("Get initiative error:", err);
    return { error: "Network error fetching initiative" };
  }
};

// Create new initiative
export const createInitiative = async (initiativeData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { error: "Authentication required" };
    }

    const response = await fetch(`${BACKEND_URL}/api/initiative`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(initiativeData),
    });

    const data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return data;
    } else {
      return {
        error: data.message || "Failed to create initiative",
      };
    }
  } catch (err) {
    console.error("Create initiative error:", err);
    return { error: "Network error creating initiative" };
  }
};

// Update initiative
export const updateInitiative = async (id, initiativeData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { error: "Authentication required" };
    }

    const response = await fetch(`${BACKEND_URL}/api/initiative/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(initiativeData),
    });

    const data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return data;
    } else {
      return {
        error: data.message || "Failed to update initiative",
      };
    }
  } catch (err) {
    console.error("Update initiative error:", err);
    return { error: "Network error updating initiative" };
  }
};

// Delete initiative
export const deleteInitiative = async (id) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { error: "Authentication required" };
    }

    const response = await fetch(`${BACKEND_URL}/api/initiative/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return { success: true, message: data.message };
    } else {
      return {
        error: data.message || "Failed to delete initiative",
      };
    }
  } catch (err) {
    console.error("Delete initiative error:", err);
    return { error: "Network error deleting initiative" };
  }
};

// Join initiative
export const joinInitiative = async (id) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { error: "Authentication required" };
    }

    const response = await fetch(`${BACKEND_URL}/api/initiative/${id}/join`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: data.message,
        redirectUrl: data.redirectUrl,
      };
    } else {
      return {
        error: data.message || "Failed to join initiative",
        redirectUrl: data.redirectUrl, // Still pass the redirectUrl even on error
      };
    }
  } catch (err) {
    console.error("Join initiative error:", err);
    return { error: "Network error joining initiative" };
  }
};

// export const getUserJoinedInitiatives = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       return { error: "Authentication required", initiatives: [] };
//     }

//     const response = await fetch(`${BACKEND_URL}/api/user/joined-initiative`, {
//       headers: {
//         Authorization: token,
//       },
//     });

//     const data = await response.json();

//     if (response.status >= 200 && response.status < 300) {
//       return data;
//     } else {
//       return {
//         error: data.message || "Failed to fetch joined initiatives",
//         initiatives: [],
//       };
//     }
//   } catch (err) {
//     console.error("Get joined initiatives error:", err);
//     return { error: "Network error", initiatives: [] };
//   }
// };
