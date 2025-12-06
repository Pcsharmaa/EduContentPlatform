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

export const paymentService = {
  // Get pricing plans
  async getPricingPlans() {
    // This would be a real endpoint in your API
    return {
      data: [
        {
          id: "basic",
          name: "Basic",
          price: 0,
          features: [
            "Access to free content",
            "Basic search functionality",
            "Limited bookmarks",
          ],
        },
        {
          id: "premium",
          name: "Premium",
          price: 9.99,
          period: "monthly",
          features: [
            "Access to all content",
            "Advanced search",
            "Unlimited bookmarks",
            "Download content",
            "Priority support",
          ],
        },
        {
          id: "institutional",
          name: "Institutional",
          price: 499.99,
          period: "yearly",
          features: [
            "Unlimited access for institution",
            "Custom content hosting",
            "Analytics dashboard",
            "Dedicated support",
            "API access",
          ],
        },
      ],
    };
  },

  // Create checkout session
  async createCheckout(checkoutData) {
    // This would integrate with your payment gateway
    return {
      data: {
        sessionId: "cs_test_" + Math.random().toString(36).substr(2, 9),
        clientSecret:
          "pi_" + Math.random().toString(36).substr(2, 12) + "_secret",
      },
    };
  },

  // Get subscription details
  async getSubscription() {
    // This would be a real endpoint in your API
    return {
      data: {
        plan: "premium",
        status: "active",
        currentPeriodEnd: "2024-04-01",
        cancelAtPeriodEnd: false,
      },
    };
  },

  // Update subscription
  async updateSubscription(subscriptionData) {
    // This would be a real endpoint in your API
    return {
      data: {
        success: true,
        message: "Subscription updated successfully",
      },
    };
  },

  // Cancel subscription
  async cancelSubscription() {
    // This would be a real endpoint in your API
    return {
      data: {
        success: true,
        message:
          "Subscription will be canceled at the end of the billing period",
      },
    };
  },
};
