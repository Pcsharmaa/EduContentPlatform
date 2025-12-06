import React from 'react';
import { usePermission } from '../hooks/usePermission';

/**
 * PermissionGuard Component
 * 
 * Usage:
 *   <PermissionGuard permission="edit_own_content">
 *     <button>Edit Content</button>
 *   </PermissionGuard>
 * 
 *   <PermissionGuard permissions={['publish_content', 'approve_content']} mode="any">
 *     <button>Publish or Approve</button>
 *   </PermissionGuard>
 * 
 *   <PermissionGuard permissions={['edit_all_content', 'manage_users']} mode="all">
 *     <AdminPanel />
 *   </PermissionGuard>
 * 
 * Props:
 *   - permission (string): Single permission to check
 *   - permissions (array): Multiple permissions to check
 *   - mode ('any' | 'all'): For multiple permissions, check any or all
 *   - fallback (React element): What to show if user lacks permission (default: null)
 *   - children: Content to render if user has permission
 */
export const PermissionGuard = ({
  permission,
  permissions = [],
  mode = 'any',
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  let hasAccess = false;

  if (permission) {
    // Single permission check
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    // Multiple permissions check
    hasAccess = mode === 'all' 
      ? hasAllPermissions(permissions) 
      : hasAnyPermission(permissions);
  }

  return hasAccess ? children : fallback;
};

/**
 * Higher-Order Component to protect entire components with permission checks
 * 
 * Usage:
 *   export default withPermission(AdminPanel, 'manage_users');
 */
export const withPermission = (Component, permission) => {
  return (props) => {
    const { hasPermission } = usePermission();

    if (!hasPermission(permission)) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          <p>You don't have permission to access this feature.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default PermissionGuard;
