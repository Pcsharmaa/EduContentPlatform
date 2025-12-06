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

export const editorialService = {
  // Get editorial dashboard data
  async getEditorialDashboard() {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EDITORIAL.GET_DASHBOARD}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Get content queue
  async getContentQueue() {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EDITORIAL.GET_CONTENT_QUEUE}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Assign reviewer
  async assignReviewer(assignmentData) {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EDITORIAL.ASSIGN_REVIEWER}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(assignmentData),
      }
    );

    return handleResponse(response);
  },

  // Approve content
  async approveContent(approvalData) {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EDITORIAL.APPROVE_CONTENT}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(approvalData),
      }
    );

    return handleResponse(response);
  },

  // Get editorial calendar
  async getEditorialCalendar() {
    // This would be a real endpoint in your API
    return {
      data: [
        {
          id: 1,
          title: "Review Machine Learning Course",
          type: "review",
          startDate: "2024-03-01",
          endDate: "2024-03-07",
          status: "in_progress",
        },
        {
          id: 2,
          title: "Publish Physics Research",
          type: "publication",
          startDate: "2024-03-10",
          endDate: "2024-03-10",
          status: "scheduled",
        },
      ],
    };
  },
};
