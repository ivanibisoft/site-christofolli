import pb from '@/lib/pocketbase/client'

export function getFileUrl(
  record: { id: string; collectionId?: string; collectionName?: string },
  filename: string,
): string {
  if (!filename) return ''
  const relativeUrl = pb.files.getUrl(record as any, filename)
  const urlStr = typeof relativeUrl === 'string' ? relativeUrl : relativeUrl?.toString() || ''
  if (!urlStr) return ''
  if (urlStr.startsWith('http')) return urlStr
  const base = pb.baseUrl.replace(/\/$/, '')
  return `${base}${urlStr}`
}
