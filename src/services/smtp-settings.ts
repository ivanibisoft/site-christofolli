import pb from '@/lib/pocketbase/client'

export interface SmtpTestResult {
  success: boolean
  message?: string
  error?: string
}

export const testSmtpSettings = (data: { to?: string }): Promise<SmtpTestResult> =>
  pb.send('/backend/v1/smtp/test', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
