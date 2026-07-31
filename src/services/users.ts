import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface User extends RecordModel {
  name: string
  email: string
  role: string
  created: string
}

export const getUsers = () => pb.collection<User>('users').getFullList({ sort: '-created' })

export const createUser = (data: {
  name: string
  email: string
  password: string
  passwordConfirm: string
  role: string
}) => pb.collection<User>('users').create(data)

export const deleteUser = (id: string) => pb.collection<User>('users').delete(id)

export const updateUser = (
  id: string,
  data: {
    name?: string
    role?: string
    password?: string
    passwordConfirm?: string
  },
) => {
  const payload: Record<string, string> = {}
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      payload[key] = String(value)
    }
  })
  return pb.collection<User>('users').update(id, payload)
}
