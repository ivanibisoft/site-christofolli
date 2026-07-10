import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface SmtpSettings extends RecordModel {
  host: string
  port: number
  username: string
  password: string
  encryption: string
  from_email: string
  from_name: string
}

export const getSmtpSettings = async (): Promise<SmtpSettings | null> => {
  try {
    const list = await pb.collection<SmtpSettings>('smtp_settings').getFullList()
    return list[0] || null
  } catch {
    return null
  }
}

export const createSmtpSettings = (data: Partial<SmtpSettings>) =>
  pb.collection<SmtpSettings>('smtp_settings').create(data)

export const updateSmtpSettings = (id: string, data: Partial<SmtpSettings>) =>
  pb.collection<SmtpSettings>('smtp_settings').update(id, data)

export const testSmtpSettings = (data: {
  host: string
  port: number
  username: string
  password: string
  encryption: string
  from_email: string
  from_name: string
}) =>
  pb.send('/backend/v1/smtp/test', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
