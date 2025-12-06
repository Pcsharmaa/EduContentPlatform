import { de } from "date-fns/locale";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

// Helper function to handle API responses
const handleResponse = async (response) => {
  let data = {};

  // Check if response has content
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
        console.error("Response body:", text);
        throw new Error("Invalid response format from server");
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

export const authService = {
  // Register user
  async register(userData) {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    return handleResponse(response);
  },

  // Login user
  async login(credentials) {
    debugger;
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    const data = await handleResponse(response);

    // Store token and user data in localStorage
    if (data.data?.token && data.data?.user) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    return handleResponse(response);
  },

  // Reset password
  async resetPassword(token, newPassword) {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      }
    );

    return handleResponse(response);
  },

  // Logout
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem("token");
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },
};
