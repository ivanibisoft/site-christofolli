import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface Contact extends RecordModel {
  name: string
  email: string
  company_name?: string
  whatsapp?: string
  subject?: string
  message: string
}

export interface ContactSubmitResult {
  success: boolean
  error?: string
}

export const getContacts = () =>
  pb.collection<Contact>('contacts').getFullList({ sort: '-created' })

export const createContact = (data: Partial<Contact>) =>
  pb.collection<Contact>('contacts').create(data)

export const deleteContact = (id: string) => pb.collection('contacts').delete(id)

export const submitContact = async (data: Partial<Contact>): Promise<ContactSubmitResult> => {
  try {
    return await pb.send('/backend/v1/contacts/submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    const errorMsg =
      error?.response?.message || error?.message || 'Não foi possível enviar a mensagem.'
    return { success: false, error: errorMsg }
  }
}
