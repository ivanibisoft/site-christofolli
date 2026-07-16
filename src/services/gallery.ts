import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'
import { getGalleryCategories } from '@/services/gallery-categories'

export const STATISTICAL_RESULTS_CATEGORY = 'Gráficos Estatísticos'

export type GalleryItem = RecordModel

export const getGalleryItems = () =>
  pb.collection<GalleryItem>('gallery_items').getFullList({
    sort: '-created',
    expand: 'category_id',
  })

export const getGalleryItem = (id: string) =>
  pb.collection<GalleryItem>('gallery_items').getOne(id, { expand: 'category_id' })

export const createGalleryItem = (data: Record<string, unknown>) =>
  pb.collection<GalleryItem>('gallery_items').create(data)

export const updateGalleryItem = (id: string, data: Record<string, unknown>) =>
  pb.collection<GalleryItem>('gallery_items').update(id, data)

export const deleteGalleryItem = (id: string) =>
  pb.collection<GalleryItem>('gallery_items').delete(id)

export const getStatisticalResultsCategory = async () => {
  const categories = await getGalleryCategories()
  return categories.find((c) => c.name === STATISTICAL_RESULTS_CATEGORY)
}

export const getStatisticalResults = async () => {
  const statCategory = await getStatisticalResultsCategory()
  if (!statCategory) return []
  return pb.collection<GalleryItem>('gallery_items').getFullList({
    filter: `category_id = "${statCategory.id}"`,
    sort: '-created',
  })
}

export const getGalleryItemsExcludingStatistical = async () => {
  const statCategory = await getStatisticalResultsCategory()
  const items = await pb.collection<GalleryItem>('gallery_items').getFullList({
    sort: '-created',
    expand: 'category_id',
  })
  if (!statCategory) return items
  return items.filter((item) => item.category_id !== statCategory.id)
}
