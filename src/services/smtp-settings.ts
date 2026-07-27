import pb from '@/lib/pocketbase/client'

export interface SmtpSettings {
  host: string
  port: number
  username: string
  password: string
  encryption: string
  from_email: string
  from_name: string
}

export interface SmtpTestResult {
  success: boolean
  message?: string
  error?: string
}

export const getSmtpSettings = (): Promise<SmtpSettings> =>
  pb.send('/backend/v1/smtp/settings', { method: 'GET' })

export const saveSmtpSettings = (data: SmtpSettings): Promise<{ success: boolean }> =>
  pb.send('/backend/v1/smtp/settings', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })

export const testSmtpSettings = (data: { to?: string }): Promise<SmtpTestResult> =>
  pb.send('/backend/v1/smtp/test', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
