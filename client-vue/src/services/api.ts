import { User } from '@/constants/route-names'
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
  const response = await fetch(`${API_BASE_URL}/api/persons/`)

  if (!response.ok) {
    throw new Error('Не удалось загрузить пользователей')
  }

  const persons: User[] = await response.json() //превращает JSON в обычный массив, с которым Vue уже может работать

  return persons
}
