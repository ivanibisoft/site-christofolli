import { useEffect, useState, useRef } from 'react'
import { Building2, Save, Loader2, ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getCompanyProfile, updateCompanyProfile } from '@/services/company-profile'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'

export default function CompanyProfilePage() {
  const { toast } = useToast()
  const [profileId, setProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)
  const [bio, setBio] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadProfile = async () => {
    try {
      const profile = await getCompanyProfile()
      if (profile) {
        setProfileId(profile.id)
        setBio(profile.director_bio || '')
        if (profile.director_photo) {
          setCurrentPhotoUrl(pb.files.getUrl(profile, profile.director_photo))
        }
      }
    } catch {
      toast({ title: 'Erro ao carregar perfil da empresa', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  useRealtime('company_profile', () => {
    loadProfile()
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(selected.type)) {
      toast({
        title: 'Formato inválido',
        description: 'Formatos suportados: JPG, PNG, WebP, SVG.',
        variant: 'destructive',
      })
      return
    }

    if (selected.size > 5242880) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo permitido é 5MB.',
        variant: 'destructive',
      })
      return
    }

    setFile(selected)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(selected)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async () => {
    if (!profileId) {
      toast({ title: 'Perfil não encontrado', variant: 'destructive' })
      return
    }

    setSaving(true)
    const formData = new FormData()
    if (file) {
      formData.append('director_photo', file)
    }
    formData.append('director_bio', bio)

    try {
      await updateCompanyProfile(profileId, formData)
      toast({ title: 'Dados do perfil atualizados com sucesso!' })
      setFile(null)
      setPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      await loadProfile()
    } catch (error) {
      const fieldErrors = extractFieldErrors(error)
      if (fieldErrors.director_photo) {
        toast({
          title: 'Erro na imagem',
          description: fieldErrors.director_photo,
          variant: 'destructive',
        })
      } else if (fieldErrors.director_bio) {
        toast({
          title: 'Erro na biografia',
          description: fieldErrors.director_bio,
          variant: 'destructive',
        })
      } else {
        toast({ title: 'Erro ao salvar os dados', variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p>Carregando informações...</p>
      </div>
    )
  }

  const displayImage = preview || currentPhotoUrl

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Perfil da Empresa</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie as informações públicas da empresa.
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Foto do Diretor</h2>
            <p className="text-slate-500 text-sm">
              Esta foto será exibida na página pública "Sobre o Consultor".
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-6 transition-colors hover:bg-slate-100">
              {displayImage ? (
                <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden border bg-white shadow-sm">
                  <img
                    src={displayImage}
                    alt="Foto do Diretor"
                    className="w-full h-full object-cover"
                  />
                  {preview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
                      onClick={clearFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Nenhuma foto cadastrada</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Formatos suportados: JPG, PNG, WebP, SVG (Máx. 5MB)
                  </p>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {displayImage ? 'Trocar Foto' : 'Selecionar Foto'}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="director_bio" className="text-base font-bold text-slate-800">
                  Biografia do Diretor
                </Label>
                <p className="text-slate-500 text-sm mt-1 mb-3">
                  Este texto será exibido na página pública "Sobre o Consultor".
                </p>
                <Textarea
                  id="director_bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={6}
                  placeholder="Digite a biografia profissional do diretor..."
                  className="resize-y"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={saving}
              className="min-w-[140px] shadow-sm"
            >
              {' '}
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
