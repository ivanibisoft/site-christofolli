import pb from '@/lib/pocketbase/client'

export interface Publication {
  id: string
  collectionId: string
  collectionName: string
  title: string
  description?: string
  published_date?: string
  pdf_file?: string
  cover_image?: string
  created: string
  updated: string
}

export const getRecentPublications = async (limit: number = 3): Promise<Publication[]> => {
  const result = await pb.collection('publications').getList<Publication>(1, limit, {
    sort: '-created',
  })
  return result.items
}

export const getPublications = async (): Promise<Publication[]> => {
  return pb.collection('publications').getFullList<Publication>({
    sort: '-created',
  })
}

export const getPublication = async (id: string): Promise<Publication> => {
  return pb.collection('publications').getOne<Publication>(id)
}

export const createPublication = async (
  data: FormData | Partial<Publication>,
): Promise<Publication> => {
  return pb.collection('publications').create<Publication>(data)
}

export const updatePublication = async (
  id: string,
  data: FormData | Partial<Publication>,
): Promise<Publication> => {
  return pb.collection('publications').update<Publication>(id, data)
}

export const deletePublication = async (id: string): Promise<void> => {
  return pb.collection('publications').delete(id)
}
