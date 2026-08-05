import pb from '@/lib/pocketbase/client'

export interface SmtpSettings {
  host: string
  port: number
  username: string
  password: string
  encryption: string
  from_email: string
  from_name: string
  admin_email: string
}

export interface SmtpTestResult {
  success: boolean
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

export const testSmtpSettings = (data: SmtpSettings): Promise<SmtpTestResult> =>
  pb.send('/backend/v1/smtp_test', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
