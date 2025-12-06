import { API_ENDPOINTS } from "../../constants/apiEndpoints";

// Helper function to get auth headers for JSON
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Helper function to get auth headers for file upload
const getUploadHeaders = () => {
  const token = localStorage.getItem("token");
  return {
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

export const teacherService = {
  // Create course
  async createCourse(courseData) {
    const formData = new FormData();

    // Append all course data to form data
    Object.keys(courseData).forEach((key) => {
      if (courseData[key] !== undefined && courseData[key] !== null) {
        if (key === "thumbnail" && courseData[key] instanceof File) {
          formData.append(key, courseData[key]);
        } else {
          formData.append(key, courseData[key]);
        }
      }
    });

    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TEACHER.CREATE_COURSE}`,
      {
        method: "POST",
        headers: getUploadHeaders(),
        body: formData,
      }
    );

    return handleResponse(response);
  },

  // Create chapter
  async createChapter(courseId, chapterData) {
    const formData = new FormData();
    formData.append("chapterName", chapterData.chapterName);
    formData.append("sortOrder", chapterData.sortOrder);

    if (chapterData.description) {
      formData.append("description", chapterData.description);
    }

    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TEACHER.CREATE_CHAPTER(
        courseId
      )}`,
      {
        method: "POST",
        headers: getUploadHeaders(),
        body: formData,
      }
    );

    return handleResponse(response);
  },

  // Upload file
  async uploadFile(uploadData) {
    const formData = new FormData();

    // Append all upload data to form data
    Object.keys(uploadData).forEach((key) => {
      if (uploadData[key] !== undefined && uploadData[key] !== null) {
        if (key === "file" && uploadData[key] instanceof File) {
          formData.append(key, uploadData[key]);
        } else {
          formData.append(key, uploadData[key]);
        }
      }
    });

    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TEACHER.UPLOAD_FILE}`,
      {
        method: "POST",
        headers: getUploadHeaders(),
        body: formData,
      }
    );

    return handleResponse(response);
  },

  // Get files by chapter
  async getFilesByChapter(chapterId) {
    const response = await fetch(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TEACHER.GET_FILES(chapterId)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Get teacher's courses
  async getTeacherCourses() {
    // This would be a real endpoint in your API
    // For now, return mock data
    return {
      data: [
        {
          id: 1,
          name: "Introduction to Computer Science",
          description: "Learn the fundamentals of computer science",
          chapters: 12,
          students: 150,
          status: "published",
          createdAt: "2024-01-15",
        },
        {
          id: 2,
          name: "Web Development Bootcamp",
          description: "Full-stack web development course",
          chapters: 24,
          students: 230,
          status: "draft",
          createdAt: "2024-02-10",
        },
      ],
    };
  },
};
