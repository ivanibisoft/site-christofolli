import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface TimelineItem extends RecordModel {
  title: string
  institution: string
  description: string
  period: string
  type: 'professional' | 'academic'
  order: number
}

export const getTimelineItems = () =>
  pb.collection<TimelineItem>('timeline_items').getFullList({
    sort: 'order',
  })

export const getTimelineItem = (id: string) =>
  pb.collection<TimelineItem>('timeline_items').getOne(id)

export const createTimelineItem = (data: Record<string, unknown>) =>
  pb.collection<TimelineItem>('timeline_items').create(data)

export const updateTimelineItem = (id: string, data: Record<string, unknown>) =>
  pb.collection<TimelineItem>('timeline_items').update(id, data)

export const deleteTimelineItem = (id: string) =>
  pb.collection<TimelineItem>('timeline_items').delete(id)
