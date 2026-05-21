import type { User } from '../types/user'
//import axios from 'axios'
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

// Получить список пользователей
export async function fetchPersons() {
  const response = await fetch(`${API_BASE_URL}/app/persons/`)

  if (!response.ok) {
    throw new Error('Не удалось загрузить пользователей')
  }

  const persons: User[] = await response.json() //превращает JSON в обычный массив, с которым Vue уже может работать

  return persons
}

export async function fetchCoursesByPerson() {
  const response = await fetch(`${API_BASE_URL}/app/persons/`) // узнать url с бэка
  if (!response.ok) {
    throw new Error('Не удалось загрузить курсы пользователя')
  }
  const courses: Course[] = await response.json()

  return courses
}
