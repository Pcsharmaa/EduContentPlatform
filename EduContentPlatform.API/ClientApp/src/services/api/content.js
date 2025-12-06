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
  let data = null;

  try {
    data = await response.json();
  } catch (e) {
    // In case the API returns empty response or invalid JSON
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const contentService = {
  // Submit publication
  async submitPublication(publicationData) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CONTENT.SUBMIT_PUBLICATION}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(publicationData),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error submitting publication:", error);
      throw error;
    }
  },

  // Submit volume
  async submitVolume(publicationId, volumeData) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CONTENT.SUBMIT_VOLUME(
          publicationId
        )}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(volumeData),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error submitting volume:", error);
      throw error;
    }
  },

  // Submit article
  async submitArticle(publicationId, articleData) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CONTENT.SUBMIT_ARTICLE(
          publicationId
        )}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(articleData),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error submitting article:", error);
      throw error;
    }
  },

  // Get pending items for current user's role
  async getPendingItems() {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CONTENT.GET_PENDING}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching pending items:", error);
      throw error;
    }
  },

  // Get publication by ID
  async getPublication(id) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CONTENT.GET_PUBLICATION(id)}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching publication:", error);
      throw error;
    }
  },

  // Purchase content
  async purchaseContent(purchaseData) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CONTENT.PURCHASE}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(purchaseData),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error purchasing content:", error);
      throw error;
    }
  },

  // Check access to content
  async checkAccess(itemType, itemId) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CONTENT.CHECK_ACCESS(
          itemType,
          itemId
        )}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error checking access:", error);
      throw error;
    }
  },

  // Assign item to an editor (itemType: publication|volume|article)
  async assignToEditor(itemType, itemId, editorUserId) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CONTENT.ASSIGN_TO_EDITOR(
          itemType,
          itemId,
          editorUserId
        )}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error assigning to editor:", error);
      throw error;
    }
  },

  // Grant access (admin)
  async grantAccess(grantData) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CONTENT.GRANT_ACCESS}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(grantData),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error granting access:", error);
      throw error;
    }
  },

  // Get featured content (mock)
  async getFeatured() {
    return [
      {
        id: 1,
        title: "Introduction to Machine Learning",
        description: "Learn the fundamentals of machine learning",
        type: "course",
        category: "Computer Science",
        author: "Dr. Sarah Johnson",
        price: 49.99,
        rating: 4.8,
        thumbnail: "/images/ml-course.jpg",
      },
      {
        id: 2,
        title: "Advanced Physics Research",
        description: "Comprehensive guide to modern physics research",
        type: "publication",
        category: "Physics",
        author: "Prof. Albert Smith",
        price: 39.99,
        rating: 4.6,
        thumbnail: "/images/physics-research.jpg",
      },
      {
        id: 3,
        title: "Digital Marketing Strategies",
        description: "Modern approaches to digital marketing",
        type: "course",
        category: "Business",
        author: "Emma Wilson",
        price: 29.99,
        rating: 4.7,
        thumbnail: "/images/marketing.jpg",
      },
    ];
  },

  // Get user's purchased content (mock)
  async getUserContent() {
    return {
      data: [
        {
          id: 1,
          title: "Machine Learning Fundamentals",
          type: "course",
          purchasedAt: "2024-01-15",
          progress: 75,
        },
        {
          id: 2,
          title: "Advanced Physics Research Papers",
          type: "publication",
          purchasedAt: "2024-02-10",
          progress: 100,
        },
      ],
    };
  },
};
