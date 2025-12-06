import { USER_ROLES, ROLE_PERMISSIONS } from "../constants/userRoles";

/**
 * Utility functions for role-based checks
 * These complement usePermission hook and can be used in non-React contexts
 */

export const RoleUtils = {
  /**
   * Check if a user has a specific permission
   */
  hasPermission: (userRole, permission) => {
    if (!userRole) return false;
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes(permission);
  },

  /**
   * Get all permissions for a role
   */
  getPermissions: (userRole) => {
    return ROLE_PERMISSIONS[userRole] || [];
  },

  /**
   * Check if user can create content (multiple roles allowed)
   */
  canCreateContent: (userRole) => {
    return ["admin", "teacher", "scholar", "editor"].includes(userRole);
  },

  /**
   * Check if user can edit content
   */
  canEditContent: (userRole, isOwnContent = false) => {
    if (userRole === "admin" || userRole === "editor") return true;
    if (userRole === "teacher" && isOwnContent) return true;
    if (userRole === "scholar" && isOwnContent) return true;
    return false;
  },

  /**
   * Check if user can publish content
   */
  canPublish: (userRole) => {
    return ["admin", "scholar", "editor"].includes(userRole);
  },

  /**
   * Check if user can manage users
   */
  canManageUsers: (userRole) => {
    return userRole === "admin";
  },

  /**
   * Check if user can review content
   */
  canReview: (userRole) => {
    return ["admin", "editor", "reviewer"].includes(userRole);
  },

  /**
   * Check if user can approve/reject content
   */
  canApproveContent: (userRole) => {
    return ["admin", "editor", "reviewer"].includes(userRole);
  },

  /**
   * Check if user has access to admin panel
   */
  canAccessAdmin: (userRole) => {
    return userRole === "admin";
  },

  /**
   * Check if user has access to editorial dashboard
   */
  canAccessEditorial: (userRole) => {
    return ["admin", "editor", "reviewer"].includes(userRole);
  },

  /**
   * Get user-friendly display name for role
   */
  getRoleDisplayName: (userRole) => {
    const displayNames = {
      admin: "Administrator",
      teacher: "Teacher",
      student: "Student",
      scholar: "Publisher",
      editor: "Editor",
      reviewer: "Reviewer",
    };
    return displayNames[userRole] || userRole;
  },

  /**
   * Get role description for UI display
   */
  getRoleDescription: (userRole) => {
    const descriptions = {
      admin: "Full system access and management",
      teacher: "Create and manage educational content",
      student: "View content and submit assignments",
      scholar: "Publish research and content",
      editor: "Review and edit all content",
      reviewer: "Review and provide feedback on submissions",
    };
    return descriptions[userRole] || "";
  },
};

export default RoleUtils;
