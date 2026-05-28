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

// Получить массив пользователей
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

export async function fetchCreateCourse(data: CreateCourseData) {
  const response = await axios.post(`${API_BASE_URL}/app/courses/`, data)
  return response.data
}

export async function fetchDeleteCourse(courseId: number) {
  await axios.delete(`${API_BASE_URL}/app/courses/${courseId}/`)
}
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

export async function fetchTopicById(topicId: number) {
  const response = await axios.get<Topic>(`${API_BASE_URL}/app/topics/${topicId}/`)
  return response.data
}

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
