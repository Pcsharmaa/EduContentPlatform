import React from 'react';
import { usePermission } from '../hooks/usePermission';
import { PermissionGuard } from '../components/PermissionGuard';
import RoleUtils from '../utils/roleUtils';

/**
 * Example Component: Content Actions Bar
 * 
 * This demonstrates how to use all three permission-checking methods:
 * 1. usePermission hook
 * 2. PermissionGuard component
 * 3. RoleUtils utility functions
 */

const ContentActionsExample = ({ content }) => {
  const { hasPermission, isAdmin, isEditor, isReviewer } = usePermission();
  const userRole = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : null;

  return (
    <div className="content-actions">
      <h3>Content: {content.title}</h3>

      {/* Method 1: Using usePermission hook */}
      <div className="action-group">
        <h4>Method 1: usePermission Hook</h4>
        
        {hasPermission('edit_any_content') && (
          <button className="btn btn-primary">✏️ Edit Content</button>
        )}

        {hasPermission('publish_content') && (
          <button className="btn btn-success">📤 Publish</button>
        )}

        {isReviewer && (
          <button className="btn btn-info">👁️ Review</button>
        )}

        {isAdmin && (
          <button className="btn btn-danger">🗑️ Delete</button>
        )}
      </div>

      {/* Method 2: Using PermissionGuard Component */}
      <div className="action-group">
        <h4>Method 2: PermissionGuard Component</h4>

        <PermissionGuard permission="edit_any_content">
          <button className="btn btn-primary">✏️ Edit (via Guard)</button>
        </PermissionGuard>

        <PermissionGuard 
          permissions={['publish_content', 'approve_content']} 
          mode="any"
        >
          <button className="btn btn-success">📤 Publish or Approve</button>
        </PermissionGuard>

        <PermissionGuard 
          permission="manage_users"
          fallback={<span style={{ color: '#999' }}>No access to user management</span>}
        >
          <button className="btn btn-warning">👥 Manage Users</button>
        </PermissionGuard>
      </div>

      {/* Method 3: Using RoleUtils */}
      <div className="action-group">
        <h4>Method 3: RoleUtils Utility Functions</h4>

        {RoleUtils.canEditContent(userRole, false) && (
          <button className="btn btn-primary">✏️ Edit (via Utils)</button>
        )}

        {RoleUtils.canPublish(userRole) && (
          <button className="btn btn-success">📤 Publish (via Utils)</button>
        )}

        {RoleUtils.canReview(userRole) && (
          <button className="btn btn-info">👁️ Review (via Utils)</button>
        )}

        {RoleUtils.canManageUsers(userRole) && (
          <button className="btn btn-warning">👥 Manage Users (via Utils)</button>
        )}
      </div>

      {/* Role Information Display */}
      <div className="info-section">
        <h4>Current Role Information</h4>
        <p><strong>Role:</strong> {RoleUtils.getRoleDisplayName(userRole)}</p>
        <p><strong>Description:</strong> {RoleUtils.getRoleDescription(userRole)}</p>
        <p><strong>Permissions:</strong> {RoleUtils.getPermissions(userRole).join(', ')}</p>
      </div>

      <style>{`
        .content-actions {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .action-group {
          margin: 20px 0;
          padding: 15px;
          background: white;
          border-radius: 6px;
          border-left: 4px solid #007bff;
        }

        .action-group h4 {
          margin-top: 0;
          color: #333;
        }

        .action-group button {
          margin-right: 10px;
          margin-bottom: 10px;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          margin: 4px;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-info {
          background: #17a2b8;
          color: white;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-warning {
          background: #ffc107;
          color: black;
        }

        .info-section {
          margin-top: 20px;
          padding: 15px;
          background: #e7f3ff;
          border-radius: 6px;
          border-left: 4px solid #007bff;
        }

        .info-section p {
          margin: 8px 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default ContentActionsExample;
