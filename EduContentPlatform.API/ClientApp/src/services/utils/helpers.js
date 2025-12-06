// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll/resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Format currency
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

// Generate unique ID
export const generateId = (prefix = "id") => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Convert camelCase to Title Case
export const camelToTitle = (text) => {
  if (!text) return "";
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Safe JSON parse
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
};

// Safe JSON stringify
export const safeJsonStringify = (data, defaultValue = "") => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    return defaultValue;
  }
};

// Get query parameters from URL
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
};

// Set query parameters in URL
export const setQueryParams = (params, replace = false) => {
  const url = new URL(window.location);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  if (replace) {
    window.history.replaceState({}, "", url);
  } else {
    window.history.pushState({}, "", url);
  }
};

// Remove empty values from object
export const removeEmptyValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) =>
        v !== null &&
        v !== undefined &&
        v !== "" &&
        !(Array.isArray(v) && v.length === 0)
    )
  );
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Merge objects
export const mergeObjects = (target, source) => {
  const result = { ...target };

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = mergeObjects(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
};

// Get object value by path
export const getValueByPath = (obj, path, defaultValue = undefined) => {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }

  return result;
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, direction = "asc") => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, keys = []) => {
  if (!searchTerm) return array;

  const term = searchTerm.toLowerCase();

  return array.filter((item) => {
    if (keys.length > 0) {
      return keys.some((key) =>
        String(getValueByPath(item, key, "")).toLowerCase().includes(term)
      );
    }

    // Search in all string values
    return Object.values(item).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(term)
    );
  });
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Generate random number in range
export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Delay function
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Check if value is empty
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

// Generate array of numbers
export const range = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
