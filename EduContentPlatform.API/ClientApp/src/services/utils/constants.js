export const APP_CONSTANTS = {
  // App configuration
  APP_NAME: "EduContent Platform",
  APP_VERSION: "1.0.0",
  DEFAULT_LANGUAGE: "en",

  // Pagination
  ITEMS_PER_PAGE: 12,
  MAX_PAGE_SIZE: 100,

  // Upload limits
  MAX_FILE_SIZE_MB: 10,
  MAX_FILES_PER_UPLOAD: 10,
  MAX_TOTAL_UPLOAD_SIZE_MB: 100,

  // Content limits
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_TAGS_PER_CONTENT: 10,
  MAX_TAG_LENGTH: 50,

  // User limits
  MAX_USERNAME_LENGTH: 50,
  MAX_BIO_LENGTH: 500,

  // Search
  SEARCH_DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 50,

  // Cache
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  CACHE_MAX_ITEMS: 100,

  // Notifications
  NOTIFICATION_TIMEOUT: 5000,
  MAX_NOTIFICATIONS: 10,

  // Analytics
  ANALYTICS_SAMPLE_RATE: 0.1,
  SESSION_TIMEOUT_MINUTES: 30,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: "token",
  USER_DATA: "user",
  THEME: "theme",
  LANGUAGE: "language",
  RECENT_SEARCHES: "recent_searches",
  CART_ITEMS: "cart_items",
  WISHLIST: "wishlist",
  SETTINGS: "settings",
};

export const SESSION_STORAGE_KEYS = {
  FORM_DATA: "form_data",
  TEMP_UPLOADS: "temp_uploads",
  REDIRECT_URL: "redirect_url",
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "You need to be logged in to perform this action.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  FILE_TOO_LARGE: "File is too large. Maximum size is {size}MB.",
  INVALID_FILE_TYPE: "Invalid file type. Allowed types: {types}",
  RATE_LIMIT: "Too many requests. Please try again later.",
  DEFAULT: "Something went wrong. Please try again.",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Logged in successfully!",
  REGISTER_SUCCESS: "Account created successfully!",
  LOGOUT_SUCCESS: "Logged out successfully!",
  UPDATE_SUCCESS: "Updated successfully!",
  DELETE_SUCCESS: "Deleted successfully!",
  UPLOAD_SUCCESS: "Uploaded successfully!",
  PUBLISH_SUCCESS: "Published successfully!",
  PURCHASE_SUCCESS: "Purchase successful!",
  SAVED_SUCCESS: "Saved successfully!",
  SUBMITTED_SUCCESS: "Submitted successfully!",
};
