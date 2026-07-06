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
