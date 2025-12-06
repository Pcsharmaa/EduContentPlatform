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

export const reviewService = {
  // Get review queue
  async getReviewQueue() {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.REVIEW.GET_REVIEW_QUEUE}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Submit review
  async submitReview(reviewData) {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.REVIEW.SUBMIT_REVIEW}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData),
      }
    );

    return handleResponse(response);
  },

  // Get review history
  async getReviewHistory() {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.REVIEW.GET_REVIEW_HISTORY}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Get reviewer statistics
  async getReviewerStats() {
    // This would be a real endpoint in your API
    return {
      data: {
        pendingReviews: 5,
        completedReviews: 12,
        averageRating: 4.2,
        responseTime: "2.5 days",
      },
    };
  },
};
