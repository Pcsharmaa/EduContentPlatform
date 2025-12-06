import {
  format,
  formatDistance,
  formatRelative,
  differenceInDays,
  parseISO,
} from "date-fns";

export const dateUtils = {
  // Format date in various ways
  formatDate(date, formatString = "PPP") {
    try {
      const dateObj = date instanceof Date ? date : parseISO(date);
      return format(dateObj, formatString);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  },

  // Format date as relative time (e.g., "2 days ago")
  formatRelativeTime(date) {
    try {
      const dateObj = date instanceof Date ? date : parseISO(date);
      return formatDistance(dateObj, new Date(), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting relative time:", error);
      return "Invalid date";
    }
  },

  // Format date as relative to now (e.g., "today at 10:30 AM")
  formatRelative(date) {
    try {
      const dateObj = date instanceof Date ? date : parseISO(date);
      return formatRelative(dateObj, new Date());
    } catch (error) {
      console.error("Error formatting relative date:", error);
      return "Invalid date";
    }
  },

  // Check if date is today
  isToday(date) {
    try {
      const dateObj = date instanceof Date ? date : parseISO(date);
      const today = new Date();
      return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
      );
    } catch (error) {
      return false;
    }
  },

  // Check if date is yesterday
  isYesterday(date) {
    try {
      const dateObj = date instanceof Date ? date : parseISO(date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      return (
        dateObj.getDate() === yesterday.getDate() &&
        dateObj.getMonth() === yesterday.getMonth() &&
        dateObj.getFullYear() === yesterday.getFullYear()
      );
    } catch (error) {
      return false;
    }
  },

  // Check if date is in the past week
  isPastWeek(date) {
    try {
      const dateObj = date instanceof Date ? date : parseISO(date);
      const daysDifference = differenceInDays(new Date(), dateObj);
      return daysDifference <= 7;
    } catch (error) {
      return false;
    }
  },

  // Format date for display in UI
  formatForDisplay(date) {
    try {
      const dateObj = date instanceof Date ? date : parseISO(date);

      if (this.isToday(dateObj)) {
        return `Today at ${format(dateObj, "h:mm a")}`;
      } else if (this.isYesterday(dateObj)) {
        return `Yesterday at ${format(dateObj, "h:mm a")}`;
      } else if (this.isPastWeek(dateObj)) {
        return format(dateObj, "EEEE");
      } else {
        return this.formatDate(dateObj, "MMM d, yyyy");
      }
    } catch (error) {
      return "Invalid date";
    }
  },

  // Format date for API
  formatForAPI(date) {
    try {
      const dateObj = date instanceof Date ? date : parseISO(date);
      return dateObj.toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  },

  // Format duration in minutes to readable format
  formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
      } else {
        return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} min${
          remainingMinutes !== 1 ? "s" : ""
        }`;
      }
    }
  },

  // Get age from birth date
  getAge(birthDate) {
    try {
      const birthDateObj =
        birthDate instanceof Date ? birthDate : parseISO(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }

      return age;
    } catch (error) {
      return null;
    }
  },
};
