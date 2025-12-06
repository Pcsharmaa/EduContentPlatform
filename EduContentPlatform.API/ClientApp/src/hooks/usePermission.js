import { useAuth } from "../context/AuthContext";
import { ROLE_PERMISSIONS } from "../constants/userRoles";

/**
 * Hook to check if the current user has a specific permission
 * Usage: const { hasPermission } = usePermission();
 *        if (hasPermission('edit_own_content')) { ... }
 */
export const usePermission = () => {
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    return rolePermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!Array.isArray(permissions)) return false;
    return permissions.some((p) => hasPermission(p));
  };

  const hasAllPermissions = (permissions) => {
    if (!Array.isArray(permissions)) return false;
    return permissions.every((p) => hasPermission(p));
  };

  const userRole = user?.role;
  const isAdmin = userRole === "admin";
  const isTeacher = userRole === "teacher";
  const isStudent = userRole === "student";
  const isScholar = userRole === "scholar";
  const isEditor = userRole === "editor";
  const isReviewer = userRole === "reviewer";

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole,
    isAdmin,
    isTeacher,
    isStudent,
    isScholar,
    isEditor,
    isReviewer,
  };
};
