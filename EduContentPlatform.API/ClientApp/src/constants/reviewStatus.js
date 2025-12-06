export const REVIEW_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  REVISIONS_NEEDED: "revisions_needed",
  APPROVED: "approved",
  REJECTED: "rejected",
  PUBLISHED: "published",
};

export const REVIEW_STATUS_DISPLAY = {
  [REVIEW_STATUS.PENDING]: "Pending Review",
  [REVIEW_STATUS.UNDER_REVIEW]: "Under Review",
  [REVIEW_STATUS.REVISIONS_NEEDED]: "Revisions Needed",
  [REVIEW_STATUS.APPROVED]: "Approved",
  [REVIEW_STATUS.REJECTED]: "Rejected",
  [REVIEW_STATUS.PUBLISHED]: "Published",
};
