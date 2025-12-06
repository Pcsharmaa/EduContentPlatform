# Role-Based Access Control (RBAC) Implementation Guide

## Quick Reference: Role Permissions

### Admin ✅

- Full access to everything
- Manage users, roles, settings
- Manage all content (view, edit, delete, publish)

### Teacher ✅

- Create and edit own content
- Upload educational materials
- View students

### Student ✅

- View assigned content
- Submit assignments
- Bookmark and purchase content

### Publisher (Scholar) ✅

- Create and publish content
- Manage published items

### Editor ✅

- Edit any content
- Assign reviewers
- View all content
- **Cannot publish** (must be approved/published by admin or publisher)

### Reviewer ✅

- Review assigned submissions
- Approve or reject content
- Provide feedback

---

## Implementation Examples

### 1. Check Permissions in React Components

#### Using `usePermission` Hook:

```jsx
import { usePermission } from "../hooks/usePermission";

function MyContent() {
  const { hasPermission, isAdmin, isTeacher } = usePermission();

  return (
    <div>
      {hasPermission("edit_own_content") && <button>Edit My Content</button>}

      {isTeacher && <button>View Students</button>}

      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### 2. Conditionally Render UI with PermissionGuard

```jsx
import { PermissionGuard } from "../components/PermissionGuard";

function ContentActions() {
  return (
    <div>
      {/* Single permission */}
      <PermissionGuard permission="publish_content">
        <button>Publish Content</button>
      </PermissionGuard>

      {/* Multiple permissions (any) - show if user has ANY of these */}
      <PermissionGuard
        permissions={["publish_content", "approve_content"]}
        mode="any"
      >
        <button>Publish or Approve</button>
      </PermissionGuard>

      {/* Multiple permissions (all) - show only if user has ALL of these */}
      <PermissionGuard
        permissions={["manage_users", "manage_all_content"]}
        mode="all"
      >
        <AdminPanel />
      </PermissionGuard>

      {/* With fallback (show something if no permission) */}
      <PermissionGuard
        permission="publish_content"
        fallback={<p>You don't have permission to publish</p>}
      >
        <button>Publish Content</button>
      </PermissionGuard>
    </div>
  );
}
```

### 3. Protect Entire Components with HOC

```jsx
import { withPermission } from "../components/PermissionGuard";

function AdminPanel() {
  return <div>Admin controls...</div>;
}

// This component will only show if user has 'manage_users' permission
export default withPermission(AdminPanel, "manage_users");
```

### 4. Use RoleUtils for Non-React Contexts

```jsx
import RoleUtils from "../utils/roleUtils";

// Check permissions
if (RoleUtils.canPublish(userRole)) {
  // Show publish button
}

if (RoleUtils.canEditContent(userRole, isOwnContent)) {
  // Show edit button
}

// Get display names
const displayName = RoleUtils.getRoleDisplayName("teacher"); // "Teacher"
const description = RoleUtils.getRoleDescription("admin"); // "Full system access..."
```

### 5. Update Routes in App.jsx

The routes are already set up correctly using `ProtectedRoute` with `allowedRoles`.
Example:

```jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
```

---

## Common Patterns

### Disable Button Based on Permission

```jsx
import { usePermission } from "../hooks/usePermission";

function EditButton({ contentId }) {
  const { hasPermission } = usePermission();

  return (
    <button
      disabled={!hasPermission("edit_own_content")}
      onClick={() => editContent(contentId)}
    >
      Edit
    </button>
  );
}
```

### Show Different UI Based on Role

```jsx
import { usePermission } from "../hooks/usePermission";

function Dashboard() {
  const { isAdmin, isTeacher, isStudent } = usePermission();

  return (
    <div>
      {isAdmin && <AdminStats />}
      {isTeacher && <TeacherStats />}
      {isStudent && <StudentStats />}
    </div>
  );
}
```

### Protect API Calls

```jsx
import RoleUtils from "../utils/roleUtils";

async function publishContent(contentId) {
  const userRole = user.role;

  if (!RoleUtils.canPublish(userRole)) {
    throw new Error("You do not have permission to publish content");
  }

  // Make API call...
}
```

---

## Permission Checklist for Development

When building features, use this checklist:

- [ ] Define who can access this feature (which roles)
- [ ] Add permission check in the component (`usePermission` or `PermissionGuard`)
- [ ] Disable/hide UI elements for unauthorized users
- [ ] Return error message if unauthorized user tries to access via API
- [ ] Add permission to `ROLE_PERMISSIONS` in `userRoles.js` if new
- [ ] Test with each role using the dev impersonation widget

---

## File Locations

- **Role definitions**: `src/constants/userRoles.js`
- **Permission hook**: `src/hooks/usePermission.js`
- **Permission components**: `src/components/PermissionGuard.jsx`
- **Role utilities**: `src/utils/roleUtils.js`
- **Route protection**: `src/App.jsx` (ProtectedRoute component)
