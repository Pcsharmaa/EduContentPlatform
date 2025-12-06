export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  SCHOLAR: "scholar",
  EDITOR: "editor",
  REVIEWER: "reviewer",
  ADMIN: "admin",
};

export const ROLE_DISPLAY_NAMES = {
  [USER_ROLES.STUDENT]: "Student",
  [USER_ROLES.TEACHER]: "Teacher",
  [USER_ROLES.SCHOLAR]: "Scholar",
  [USER_ROLES.EDITOR]: "Editor",
  [USER_ROLES.REVIEWER]: "Reviewer",
  [USER_ROLES.ADMIN]: "Administrator",
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    // Full system control - Manage users, content, settings
    "manage_users",
    "manage_user_roles",
    "delete_users",
    "manage_all_content",
    "edit_all_content",
    "delete_content",
    "publish_content",
    "unpublish_content",
    "grant_content_access",
    "revoke_content_access",
    "view_system_analytics",
    "access_system_settings",
    "moderate_content",
    "approve_content",
    "reject_content",
    "access_editorial_dashboard",
    "view_all_reviews",
    "impersonate_users", // dev only
  ],

  [USER_ROLES.TEACHER]: [
    // Create courses & educational content for students
    "create_course",
    "edit_own_course",
    "delete_own_course",
    "upload_course_content",
    "create_chapter",
    "edit_own_chapter",
    "upload_lesson_files",
    "edit_own_content",
    "view_student_enrollment",
    "view_student_progress",
    "view_course_analytics",
    "submit_for_review", // if content requires review
  ],

  [USER_ROLES.STUDENT]: [
    // Consume educational content & submit assignments
    "view_content",
    "view_assigned_content",
    "view_public_content",
    "submit_assignment",
    "view_own_submissions",
    "view_grades",
    "purchase_content",
    "bookmark_content",
    "view_assigned_analytics",
  ],

  [USER_ROLES.SCHOLAR]: [
    // Publish research & scholarly content (Publisher)
    "submit_publication",
    "submit_volume",
    "submit_article",
    "edit_own_publication",
    "edit_own_article",
    "edit_own_volume",
    "assign_to_editor",
    "publish_content",
    "manage_published_items",
    "view_publication_analytics",
    "request_review",
  ],

  [USER_ROLES.EDITOR]: [
    // Review & edit content - Quality gatekeeper
    "view_pending_content",
    "edit_any_content",
    "request_revisions",
    "approve_content",
    "reject_content",
    "assign_to_reviewer",
    "view_all_content",
    "provide_feedback",
    "update_content_status",
    "access_editorial_dashboard",
    "view_editorial_queue",
    "view_review_comments",
  ],

  [USER_ROLES.REVIEWER]: [
    // Review & provide feedback on submissions
    "view_assigned_reviews",
    "submit_review",
    "provide_feedback",
    "approve_submission",
    "reject_submission",
    "request_revisions",
    "access_editorial_dashboard",
    "view_assigned_content",
    "view_review_guidelines",
  ],
};
