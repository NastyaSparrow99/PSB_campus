import type { User } from '../types/user'
import axios from 'axios'
const API_BASE_URL = 'http://localhost:8000'

export interface Course {
  id: number
  title: string
  description: string
  progress?: number
}

export interface Topic {
  id: number
  title: string
  description: string
  course: number
  color: string
}
export interface CreateCourseData {
  title: string
  description: string
  teacher: number
}

export interface CreateTopicsData {
  title: string
  description: string
  course: number
  color: string
}
export interface Material {
  id: number
  title: string
  material_type: string
  text: string
  file?: string
  url?: string
  order: number
  course: number
  topic: number
}
export interface DownloadMaterialData {
  title: string
  material_type: string
  text: string
  url: string
  course: number
  topic: number
}
export interface Assignment {
  id: number
  course: number
  title: string
  description: string
  deadline: string
  max_grade: number
}

export interface CreateAssignment {
  course: number
  title: string
  description: string
  deadline: string
  max_grade: number
}

export interface Submission {
  id: number
  assignment: number
  student: number
  answer_text: string
  submitted_at?: string
  grade?: number | null
  teacher_comment?: string
}

export interface CreateSubmission {
  assignment: number
  student: number
  answer_text: string
}

export interface GradeSubmission {
  grade: number | null
  status: string
  teacher_comment: string
}
export interface SubmissionComment {
  id: number
  submission: number
  author: number
  author_name?: string
  text: string
  created_at?: string
}

export interface CreateSubmissionComment {
  submission: number
  author: number
  text: string
}
export interface AddStudentToCourse {
  student_id: number
}

// Пользователи
export async function fetchPersons() {
  const response = await axios.get<User[]>(`${API_BASE_URL}/app/persons/`)
  return response.data
}
export async function fetchCoursesByPerson(personId: number) {
  //запрос курсов под конкретного пользователя ,поэтому параметр id
  const response = await axios.get<Course[]>(
    `${API_BASE_URL}/app/courses/by_person/?person_id=${personId}`,
  )
  return response.data
}
// Курсы
export async function fetchCreateCourse(data: CreateCourseData) {
  const response = await axios.post(`${API_BASE_URL}/app/courses/`, data)
  return response.data
}

export async function fetchDeleteCourse(courseId: number) {
  await axios.delete(`${API_BASE_URL}/app/courses/${courseId}/`)
}

// Темы
export async function fetchTopicsByCourse(courseId: number) {
  //возвращает Topic[]
  const response = await axios.get<Topic[]>(
    `${API_BASE_URL}/app/topics/by_course/?course_id=${courseId}`,
  )
  return response.data
}

export async function fetchCreateTopic(data: CreateTopicsData) {
  const response = await axios.post(`${API_BASE_URL}/app/topics/`, data)
  return response.data
}

export async function deleteTopic(topicId: number) {
  await axios.delete(`${API_BASE_URL}/app/topics/${topicId}/`)
}

export async function fetchTopicById(topicId: number) {
  const response = await axios.get<Topic>(`${API_BASE_URL}/app/topics/${topicId}/`)
  return response.data
}

// Материалы
export async function fetchMaterials(courseId: number) {
  const response = await axios.get<Material[]>(
    `${API_BASE_URL}/app/materials/by_course/?course_id=${courseId}`,
  )
  return response.data
}

export async function fetchDownloadMaterials(data: DownloadMaterialData) {
  const response = await axios.post(`${API_BASE_URL}/app/materials/`, data)
  return response.data
}

export async function fetchDeleteMaterial(materialId: number) {
  await axios.delete(`${API_BASE_URL}/app/materials/${materialId}/`)
}
// Задания
export async function fetchAssignments(courseId: number) {
  const response = await axios.get<Assignment[]>(
    `${API_BASE_URL}/app/assignments/?course_id=${courseId}`,
  )

  return response.data
}

export async function fetchCreateAssignment(data: CreateAssignment) {
  const response = await axios.post<Assignment>(`${API_BASE_URL}/app/assignments/`, data)

  return response.data
}

// все решения
export async function fetchSubmissions() {
  const response = await axios.get<Submission[]>(`${API_BASE_URL}/app/submissions/`)
  return response.data
}
//созд решение студента
export async function fetchCreateSubmission(data: CreateSubmission) { 
  const response = await axios.post<Submission>(`${API_BASE_URL}/app/submissions/`, data)
  return response.data
}
//отправляет оценку  к конкретному решению
export async function updateSubmission(submissionId: number, data: GradeSubmission) {

  const response = await axios.post<Submission>(
    `${API_BASE_URL}/app/submissions/${submissionId}/grade/`,
      data,
  )
  // Возвращаем обновленное решение с backend
  return response.data
}

//загружаем комментарии к конкретному решению
export async function getSubmissionComments(submissionId: number) {
  const response = await axios.get<SubmissionComment[]>(
    `${API_BASE_URL}/app/comments/by_submission/?submission_id=${submissionId}`,
  )

  return response.data
}
//созд новый комментарий к решению
export async function createSubmissionComment(data: CreateSubmissionComment) {
  const response = await axios.post<SubmissionComment>(`${API_BASE_URL}/app/comments/`, data)

  return response.data
}
//добавляем студента на курс
export async function fetchAddStudentToCourse(courseId: number, data: AddStudentToCourse) {
  const response = await axios.post(
    `${API_BASE_URL}/app/courses/${courseId}/add_student/`,
    data,
  )

  return response.data
}
