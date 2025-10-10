export { default as UserForm } from "./UserForm";
export { default as UniversityForm } from "./UniversityForm";
export { default as CollegeForm } from "./CollegeForm";
export { default as FacultyForm } from "./FacultyForm";
export { default as ProgramForm } from "./ProgramForm";
export { default as CourseForm } from "./CourseForm";
export { default as ExamForm } from "./ExamForm";
export { default as QuestionForm } from "./QuestionForm";
export { default as PaymentForm } from "./PaymentForm";



export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface University {
  _id: string;
  name: string;
  code: string;
  location: string;
  description?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface College {
  _id: string;
  name: string;
  code: string;
  universityId: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Faculty {
  _id: string;
  name: string;
  email: string;
  department: string;
  universityId: string;
  collegeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  collegeId: string;
  headOfDepartment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  _id: string;
  name: string;
  code: string;
  departmentId: string;
  duration?: number;
  degreeType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  programId: string;
  credits: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  _id: string;
  title: string;
  courseId: string;
  duration: number;
  totalMarks: number;
  instructions?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  _id: string;
  questionText: string;
  examId: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  questionType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}