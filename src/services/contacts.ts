import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface Contact extends RecordModel {
  name: string
  email: string
  subject?: string
  message: string
}

export const getContacts = () =>
  pb.collection<Contact>('contacts').getFullList({ sort: '-created' })

export const createContact = (data: Partial<Contact>) =>
  pb.collection<Contact>('contacts').create(data)

export const deleteContact = (id: string) => pb.collection('contacts').delete(id)
