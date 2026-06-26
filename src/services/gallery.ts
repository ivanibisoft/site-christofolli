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
