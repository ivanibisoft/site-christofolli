import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface CompanyProfile extends RecordModel {
  director_photo: string
}

export const getCompanyProfile = async (): Promise<CompanyProfile | null> => {
  try {
    const list = await pb.collection<CompanyProfile>('company_profile').getFullList()
    return list[0] || null
  } catch {
    return null
  }
}

export const updateCompanyProfile = (id: string, data: FormData) =>
  pb.collection<CompanyProfile>('company_profile').update(id, data)

export const getDirectorPhotoUrl = (profile: CompanyProfile | null): string | null => {
  if (!profile || !profile.director_photo) return null
  return pb.files.getUrl(profile, profile.director_photo)
}
