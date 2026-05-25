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

// Получить массив пользователей
export async function fetchPersons() {
  const response = await axios.get<User[]>(`${API_BASE_URL}/app/persons/`)

  return response.data
}

export async function fetchCoursesByPerson() {
  const response = await fetch(`${API_BASE_URL}/app/persons/`) // узнать url с бэка
  if (!response.ok) {
    throw new Error('Не удалось загрузить курсы пользователя')
  }
  const courses: Course[] = await response.json()

  return courses
}
