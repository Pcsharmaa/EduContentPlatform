export const EDITORIAL_WORKFLOW = {
  SUBMISSION: "submission",
  REVIEW: "review",
  REVISION: "revision",
  DECISION: "decision",
  PUBLICATION: "publication",
};

export const WORKFLOW_STEPS = [
  {
    step: EDITORIAL_WORKFLOW.SUBMISSION,
    title: "Submission",
    description: "Author submits content for review",
  },
  {
    step: EDITORIAL_WORKFLOW.REVIEW,
    title: "Review",
    description: "Reviewers evaluate the content",
  },
  {
    step: EDITORIAL_WORKFLOW.REVISION,
    title: "Revision",
    description: "Author makes requested changes",
  },
  {
    step: EDITORIAL_WORKFLOW.DECISION,
    title: "Decision",
    description: "Editor makes final decision",
  },
  {
    step: EDITORIAL_WORKFLOW.PUBLICATION,
    title: "Publication",
    description: "Content is published",
  },
];
