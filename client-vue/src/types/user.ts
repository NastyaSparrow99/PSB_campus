export enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
}

export interface User {
  id: number
  name: string
  role: UserRole
}