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
