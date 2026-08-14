import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface CustomIcon extends RecordModel {
  name: string
  label: string
}

export const getCustomIcons = () =>
  pb.collection<CustomIcon>('custom_icons').getFullList({
    sort: 'label',
  })

export const getCustomIcon = (id: string) => pb.collection<CustomIcon>('custom_icons').getOne(id)

export const createCustomIcon = (data: Record<string, unknown>) =>
  pb.collection<CustomIcon>('custom_icons').create(data)

export const updateCustomIcon = (id: string, data: Record<string, unknown>) =>
  pb.collection<CustomIcon>('custom_icons').update(id, data)

export const deleteCustomIcon = (id: string) => pb.collection<CustomIcon>('custom_icons').delete(id)
