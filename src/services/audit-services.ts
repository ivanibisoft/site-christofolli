import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface AuditService extends RecordModel {
  title: string
  description: string
  evaluated_items: string
  objectives_and_deliveries: string
  order: number
}

export const getAuditServices = () =>
  pb.collection<AuditService>('audit_services').getFullList({
    sort: 'order',
  })

export const getAuditService = (id: string) =>
  pb.collection<AuditService>('audit_services').getOne(id)

export const createAuditService = (data: Record<string, unknown>) =>
  pb.collection<AuditService>('audit_services').create(data)

export const updateAuditService = (id: string, data: Record<string, unknown>) =>
  pb.collection<AuditService>('audit_services').update(id, data)

export const deleteAuditService = (id: string) =>
  pb.collection<AuditService>('audit_services').delete(id)
