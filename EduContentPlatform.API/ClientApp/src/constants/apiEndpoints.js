export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",

  // Auth endpoints
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },

  // Content endpoints
  CONTENT: {
    SUBMIT_PUBLICATION: "/api/content/publication/submit",
    SUBMIT_VOLUME: (publicationId) =>
      `/api/content/publication/${publicationId}/volumes/submit`,
    SUBMIT_ARTICLE: (publicationId) =>
      `/api/content/publication/${publicationId}/article/submit`,
    ASSIGN_TO_EDITOR: (itemType, itemId, editorUserId) =>
      `/api/content/assign/${itemType}/${itemId}/editor/${editorUserId}`,
    GET_PENDING: "/api/content/pending",
    GET_PUBLICATION: (id) => `/api/content/publication/${id}`,
    PURCHASE: "/api/content/purchase",
    GRANT_ACCESS: "/api/content/grant",
    CHECK_ACCESS: (itemType, itemId) =>
      `/api/content/access/${itemType}/${itemId}`,
  },

  // Teacher endpoints
  TEACHER: {
    CREATE_COURSE: "/api/teacher/courses",
    CREATE_CHAPTER: (courseId) => `/api/teacher/courses/${courseId}/chapters`,
    UPLOAD_FILE: "/api/teacher/upload",
    GET_FILES: (chapterId) => `/api/teacher/chapters/${chapterId}/files`,
  },

  // User endpoints
  USER: {
    PROFILE: "/api/user/profile",
    UPDATE_PROFILE: "/api/user/profile/update",
    CHANGE_PASSWORD: "/api/user/change-password",
  },

  // Review endpoints
  REVIEW: {
    GET_REVIEW_QUEUE: "/api/review/queue",
    SUBMIT_REVIEW: "/api/review/submit",
    GET_REVIEW_HISTORY: "/api/review/history",
  },

  // Editorial endpoints
  EDITORIAL: {
    GET_DASHBOARD: "/api/editorial/dashboard",
    GET_CONTENT_QUEUE: "/api/editorial/queue",
    ASSIGN_REVIEWER: "/api/editorial/assign",
    APPROVE_CONTENT: "/api/editorial/approve",
  },
};
