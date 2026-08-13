import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface BuilderService extends RecordModel {
  title: string
  description: string
  topics: string
  icon: string
  order: number
}

export const getBuilderServices = () =>
  pb.collection<BuilderService>('builder_services').getFullList({
    sort: 'order',
  })

export const getBuilderService = (id: string) =>
  pb.collection<BuilderService>('builder_services').getOne(id)

export const createBuilderService = (data: Record<string, unknown>) =>
  pb.collection<BuilderService>('builder_services').create(data)

export const updateBuilderService = (id: string, data: Record<string, unknown>) =>
  pb.collection<BuilderService>('builder_services').update(id, data)

export const deleteBuilderService = (id: string) =>
  pb.collection<BuilderService>('builder_services').delete(id)
