export const APP_NAME = "ExamB"
export const APP_DESCRIPTION = "Modern Exam Management Platform"

export const USER_ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const

export const EXAM_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
  SHORT_ANSWER: "short_answer",
  ESSAY: "essay",
} as const

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ADMIN_DASHBOARD: "/dashboard/admin",
  STUDENT_DASHBOARD: "/dashboard/student",
  NOT_AUTHORIZED: "/dashboard/not-authorized",
} as const
