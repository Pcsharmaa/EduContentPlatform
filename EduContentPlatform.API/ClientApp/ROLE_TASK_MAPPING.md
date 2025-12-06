# Role & Task Mapping for EduContent Platform

## Backend API Analysis (from C# Controllers)

### ContentController Endpoints:

- `POST /api/content/publication/submit` — Teachers/Scholars submit publications
- `POST /api/content/publication/{id}/volumes/submit` — Submit volume within publication
- `POST /api/content/publication/{id}/article/submit` — Submit article
- `POST /api/content/assign/{itemType}/{itemId}/editor/{editorUserId}` — Publisher assigns to editor
- `GET /api/content/pending` — Get pending items based on role
- `GET /api/content/publication/{id}` — Public view publication
- `POST /api/content/purchase` — User purchases content
- `POST /api/content/grant` — Admin grants access
- `GET /api/content/access/{itemType}/{itemId}` — Check user access

### TeacherController Endpoints:

- `POST /api/teacher/courses` — Teacher creates course
- `POST /api/teacher/courses/{id}/chapters` — Add chapters to course
- `POST /api/teacher/upload` — Upload files to course
- `GET /api/teacher/chapters/{id}/files` — Get files from chapter

---

## Current Frontend Pages & Features:

- **Admin Dashboard**: User management, content moderation, analytics, system settings
- **Editorial Dashboard**: Review queue, assign reviewers, approve/reject content
- **Teacher Upload**: Create courses, add chapters, upload content
- **Upload Page**: Generic content upload (publications, volumes, articles)
- **Dashboard**: Role-specific stats and quick actions
- **Browse**: View public content
- **Payment/Library**: Purchase and manage access

---

## ✅ FINAL ROLE DEFINITIONS & TASKS

### **Admin**

**Full system control. Manages users, content, and platform settings.**

- ✅ Manage all users (create, edit, delete, assign roles)
- ✅ Manage all content (view, edit, delete, publish)
- ✅ Grant/revoke access to content
- ✅ View system analytics and statistics
- ✅ System settings and configuration
- ✅ See admin dashboard with user/content/revenue stats
- ✅ Can impersonate other users (dev only)
- ✅ Moderate content (approve/reject/delete)
- ✅ View editorial queue and manage reviews

**Backend Policies:** `[Authorize(Policy = "Admin")]`
**Permissions:** Full access to all system features

---

### **Teacher**

**Creates courses and educational content for students.**

- ✅ Create courses with chapters and lessons
- ✅ Upload educational content/files
- ✅ Edit own courses and content
- ✅ View student enrollment
- ✅ See course analytics (views, engagement)
- ✅ Submit content for review (if required)
- ❌ Cannot publish content directly
- ❌ Cannot access editorial or admin panels
- ❌ Cannot manage other users

**Backend Policies:** `[Authorize(Policy = "Teacher")]`
**Tasks:**

1. `CreateCourse` — POST /api/teacher/courses
2. `CreateChapter` — POST /api/teacher/courses/{id}/chapters
3. `UploadContent` — POST /api/teacher/upload
4. `GetChapterFiles` — GET /api/teacher/chapters/{id}/files

---

### **Student**

**Consumes educational content and submits assignments.**

- ✅ View assigned/purchased content
- ✅ Submit assignments and coursework
- ✅ Browse public content library
- ✅ Purchase content (if paid)
- ✅ Bookmark favorite content
- ✅ View own progress/grades
- ❌ Cannot create content
- ❌ Cannot publish or edit
- ❌ Cannot review other submissions

**Backend Policies:** Default `[Authorize]` without special policy
**Tasks:**

1. `BrowseContent` — GET /api/content/publication/{id}
2. `PurchaseContent` — POST /api/content/purchase
3. `SubmitAssignment` — POST /api/content/assignment/submit
4. `ViewAccess` — GET /api/content/access/{itemType}/{itemId}

---

### **Publisher (Scholar)**

**Publishes research and scholarly publications.**

- ✅ Submit publications (research papers, articles, volumes)
- ✅ Assign reviewers/editors to publications
- ✅ Publish content (after editorial review, if approved)
- ✅ Manage published items
- ✅ View publication analytics
- ✅ Edit own publications before publishing
- ❌ Cannot edit content after publishing (read-only)
- ❌ Cannot manage other users
- ❌ Cannot access admin panel

**Backend Policies:** `[Authorize(Policy = "ContentCreator")] + Publisher role`
**Tasks:**

1. `SubmitPublication` — POST /api/content/publication/submit
2. `SubmitVolume` — POST /api/content/publication/{id}/volumes/submit
3. `SubmitArticle` — POST /api/content/publication/{id}/article/submit
4. `AssignToEditor` — POST /api/content/assign/{itemType}/{itemId}/editor/{editorId}
5. `PublishContent` — POST /api/content/publication/{id}/publish

---

### **Editor**

**Reviews and edits content before it goes public. Quality gatekeeper.**

- ✅ Review pending publications/articles
- ✅ Request revisions from authors
- ✅ Edit content for quality/clarity
- ✅ Assign content to reviewers
- ✅ See editorial queue and statistics
- ✅ Change content status (approved, rejected, needs revision)
- ❌ Cannot publish content (assigns to publisher)
- ❌ Cannot create content
- ❌ Cannot manage users

**Backend Policies:** `[Authorize(Policy = "ContentCreator")]` (editors create feedback/edits)
**Tasks:**

1. `GetPendingContent` — GET /api/content/pending (filters by role)
2. `ReviewContent` — POST /api/content/{id}/review (with feedback)
3. `RequestRevisions` — POST /api/content/{id}/request-revision
4. `AssignReviewer` — POST /api/content/assign/{id}/reviewer/{reviewerId}
5. `UpdateStatus` — POST /api/content/{id}/status (approved/rejected/revision-needed)

---

### **Reviewer**

**Provides academic/technical review and feedback on submissions.**

- ✅ View assigned content for review
- ✅ Provide detailed feedback/comments
- ✅ Approve or reject submissions
- ✅ Suggest revisions
- ✅ See only assigned content (not all content)
- ❌ Cannot edit content directly
- ❌ Cannot create content
- ❌ Cannot publish
- ❌ Cannot manage users

**Backend Policies:** `[Authorize(Policy = "ContentCreator")]` (reviews are created content)
**Tasks:**

1. `GetAssignedReviews` — GET /api/content/pending (filters by role + assigned)
2. `SubmitReview` — POST /api/content/{id}/review (with approval/rejection)
3. `ProvideFeedback` — POST /api/content/{id}/feedback
4. `ApproveSubmission` — POST /api/content/{id}/approve
5. `RejectSubmission` — POST /api/content/{id}/reject

---

## Task Workflow Example: Publishing a Research Paper

**Scenario:** Scholar submits a research paper that goes through editorial review before publishing.

1. **Scholar (Publisher role)**

   - Task: Submit publication → `POST /api/content/publication/submit`
   - Status: "Submitted" → awaits editorial review

2. **Admin or Publisher**

   - Task: Assign editor → `POST /api/content/assign/publication/{id}/editor/{editorId}`
   - Status: "AssignedToEditor"

3. **Editor**

   - Task: Review content → GET /api/content/pending
   - Options:
     - Approve → Change status to "EditorApproved"
     - Request revisions → Status "RevisionRequested" + send feedback
     - Reject → Status "Rejected"

4. **Reviewer (optional, if assigned)**

   - Task: Provide academic review → `POST /api/content/{id}/review`
   - Submit feedback and recommendation

5. **Publisher/Admin**

   - Task: Publish → `POST /api/content/publication/{id}/publish`
   - Status: "Published" → visible to students/public

6. **Student**
   - Task: View publication → `GET /api/content/publication/{id}` (public)
   - Task: Purchase if paid → `POST /api/content/purchase`
   - Task: Access content → `GET /api/content/access/publication/{id}`

---

## Frontend Route Protection

```javascript
// Admin only
/admin                    [Admin]
/admin/users             [Admin]
/admin/content           [Admin]
/admin/analytics         [Admin]
/admin/settings          [Admin]

// Editorial (Editor + Reviewer)
/editorial               [Editor, Reviewer]
/editorial/queue         [Editor, Reviewer]
/editorial/assign        [Editor]
/editorial/settings      [Editor]

// Teacher only
/teacher/upload          [Teacher]
/teacher/courses         [Teacher]

// Creator (Teacher, Scholar, Editor, Reviewer, Admin)
/upload                  [Teacher, Scholar, Editor, Reviewer, Admin]
/dashboard               [All authenticated]
/dashboard/content       [Teacher, Scholar, Editor, Reviewer, Admin]
/dashboard/publications  [Scholar, Editor, Reviewer, Admin]
/dashboard/settings      [All authenticated]

// Public
/                        [All]
/login                   [All]
/register                [All]
/browse                  [All]
/content/{id}            [All]
```

---

## Permission Summary Table

| Permission         | Admin | Teacher | Student | Scholar | Editor | Reviewer |
| ------------------ | ----- | ------- | ------- | ------- | ------ | -------- |
| Create Course      | ✅    | ✅      | ❌      | ❌      | ❌     | ❌       |
| Upload Content     | ✅    | ✅      | ❌      | ✅      | ❌     | ❌       |
| Submit Publication | ✅    | ❌      | ❌      | ✅      | ❌     | ❌       |
| Edit Own Content   | ✅    | ✅      | ❌      | ✅      | ❌     | ❌       |
| Edit Any Content   | ✅    | ❌      | ❌      | ❌      | ✅     | ❌       |
| Review Content     | ✅    | ❌      | ❌      | ❌      | ✅     | ✅       |
| Approve Content    | ✅    | ❌      | ❌      | ❌      | ✅     | ✅       |
| Publish Content    | ✅    | ❌      | ❌      | ✅      | ❌     | ❌       |
| Manage Users       | ✅    | ❌      | ❌      | ❌      | ❌     | ❌       |
| View Analytics     | ✅    | ✅      | ❌      | ✅      | ✅     | ❌       |
| Access Editorial   | ✅    | ❌      | ❌      | ❌      | ✅     | ✅       |
| Impersonate Users  | ✅    | ❌      | ❌      | ❌      | ❌     | ❌       |

---

## Implementation Next Steps

1. Update `ROLE_PERMISSIONS` in `userRoles.js` to match this definition
2. Update routes in `App.jsx` to use correct role restrictions
3. Update backend authorization policies to match frontend roles
4. Test each role workflow using dev impersonation widget
5. Add role-specific UI elements using `usePermission` hook or `PermissionGuard`
