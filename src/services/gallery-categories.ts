import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface GalleryCategory extends RecordModel {
  name: string
}

export const getGalleryCategories = () =>
  pb.collection<GalleryCategory>('gallery_categories').getFullList({ sort: 'name' })

export const getGalleryCategory = (id: string) =>
  pb.collection<GalleryCategory>('gallery_categories').getOne(id)

export const createGalleryCategory = (data: { name: string }) =>
  pb.collection<GalleryCategory>('gallery_categories').create(data)

export const updateGalleryCategory = (id: string, data: { name: string }) =>
  pb.collection<GalleryCategory>('gallery_categories').update(id, data)

export const deleteGalleryCategory = (id: string) =>
  pb.collection<GalleryCategory>('gallery_categories').delete(id)
