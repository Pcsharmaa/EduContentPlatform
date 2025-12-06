import { API_ENDPOINTS } from "../../constants/apiEndpoints";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Helper function to handle API responses safely
const handleResponse = async (response) => {
  let data = {};

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON response:", text);
        throw new Error("Invalid JSON response from server");
      }
    }
  } else {
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("Non-JSON response body:", text);
        data = {};
      }
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return data;
};

export const userService = {
  // Get user profile
  async getProfile() {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USER.PROFILE}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USER.UPDATE_PROFILE}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      }
    );

    const data = await handleResponse(response);

    // Update user in localStorage
    if (data.data?.user) {
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  // Change password
  async changePassword(passwordData) {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USER.CHANGE_PASSWORD}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
      }
    );

    return handleResponse(response);
  },

  // Get user's activity
  async getUserActivity() {
    // This would be a real endpoint in your API
    // For now, return mock data
    return {
      data: [
        {
          id: 1,
          action: "purchased_course",
          title: "Machine Learning Fundamentals",
          timestamp: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          action: "uploaded_content",
          title: "Introduction to Computer Science",
          timestamp: "2024-01-20T14:45:00Z",
        },
        {
          id: 3,
          action: "completed_course",
          title: "Web Development Basics",
          timestamp: "2024-02-05T09:15:00Z",
        },
      ],
    };
  },

  // Get user's bookmarks
  async getBookmarks() {
    // This would be a real endpoint in your API
    return {
      data: [
        {
          id: 1,
          contentId: 101,
          title: "Advanced JavaScript Concepts",
          type: "course",
          bookmarkedAt: "2024-01-10T16:20:00Z",
        },
        {
          id: 2,
          contentId: 205,
          title: "Research Paper: Quantum Computing",
          type: "publication",
          bookmarkedAt: "2024-01-25T11:10:00Z",
        },
      ],
    };
  },
};
