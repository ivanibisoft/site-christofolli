import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface PageSettings extends RecordModel {
  page: string
  title: string
  description: string
  subtitle: string
}

export const getPageSettings = async (page: string): Promise<PageSettings | null> => {
  try {
    const list = await pb.collection<PageSettings>('page_settings').getFullList({
      filter: `page = "${page}"`,
    })
    return list[0] || null
  } catch {
    return null
  }
}

export const updatePageSettings = (
  id: string,
  data: { title: string; description: string; subtitle: string },
) => pb.collection<PageSettings>('page_settings').update(id, data)

export const createPageSettings = (data: {
  page: string
  title: string
  description: string
  subtitle: string
}) => pb.collection<PageSettings>('page_settings').create(data)

/** Upsert helper: update the record if it exists, otherwise create it. */
export const savePageSettings = async (
  page: string,
  data: { title: string; description: string; subtitle: string },
): Promise<PageSettings> => {
  const existing = await getPageSettings(page)
  if (existing) {
    return updatePageSettings(existing.id, data)
  }
  return createPageSettings({ page, ...data })
}
