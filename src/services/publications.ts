import pb from '@/lib/pocketbase/client'

export interface Publication {
  id: string
  title: string
  link: string
  description?: string
  published_date?: string
  created: string
  updated: string
}

export const getPublications = async (): Promise<Publication[]> => {
  return pb.collection('publications').getFullList<Publication>({
    sort: '-created',
  })
}

export const getPublication = async (id: string): Promise<Publication> => {
  return pb.collection('publications').getOne<Publication>(id)
}

export const createPublication = async (data: Partial<Publication>): Promise<Publication> => {
  return pb.collection('publications').create<Publication>(data)
}

export const updatePublication = async (
  id: string,
  data: Partial<Publication>,
): Promise<Publication> => {
  return pb.collection('publications').update<Publication>(id, data)
}

export const deletePublication = async (id: string): Promise<void> => {
  return pb.collection('publications').delete(id)
}
