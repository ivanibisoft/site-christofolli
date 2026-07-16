import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'
import type { GalleryCategory } from '@/services/gallery-categories'

export interface GalleryItem extends RecordModel {
  title: string
  description: string
  category: string
  category_id?: string
  image: string
  expand?: {
    category_id?: GalleryCategory
  }
}

export const getGalleryItems = () =>
  pb.collection<GalleryItem>('gallery_items').getFullList({
    sort: '-created',
    expand: 'category_id',
  })

export const getGalleryItem = (id: string) =>
  pb.collection<GalleryItem>('gallery_items').getOne(id, { expand: 'category_id' })

export const createGalleryItem = (data: FormData) =>
  pb.collection<GalleryItem>('gallery_items').create(data)

export const updateGalleryItem = (id: string, data: FormData) =>
  pb.collection<GalleryItem>('gallery_items').update(id, data)

export const deleteGalleryItem = (id: string) =>
  pb.collection<GalleryItem>('gallery_items').delete(id)

export const STATISTICAL_RESULTS_CATEGORY = 'Resultados Estatísticos'

export const getStatisticalResultsCategory = async (): Promise<GalleryCategory | null> => {
  try {
    return await pb
      .collection<GalleryCategory>('gallery_categories')
      .getFirstListItem(`name = "${STATISTICAL_RESULTS_CATEGORY}"`)
  } catch {
    return null
  }
}

export const getStatisticalResults = async (): Promise<GalleryItem[]> => {
  const category = await getStatisticalResultsCategory()
  if (!category) return []
  return pb.collection<GalleryItem>('gallery_items').getFullList({
    sort: '-created',
    expand: 'category_id',
    filter: `category_id = "${category.id}"`,
  })
}
