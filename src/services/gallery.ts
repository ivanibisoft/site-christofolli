import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface GalleryItem extends RecordModel {
  title: string
  description: string
  category: string
  image: string
}

export const getGalleryItems = () =>
  pb.collection<GalleryItem>('gallery_items').getFullList({ sort: '-created' })

export const getGalleryItem = (id: string) => pb.collection<GalleryItem>('gallery_items').getOne(id)

export const createGalleryItem = (data: FormData) =>
  pb.collection<GalleryItem>('gallery_items').create(data)

export const updateGalleryItem = (id: string, data: FormData) =>
  pb.collection<GalleryItem>('gallery_items').update(id, data)

export const deleteGalleryItem = (id: string) =>
  pb.collection<GalleryItem>('gallery_items').delete(id)
