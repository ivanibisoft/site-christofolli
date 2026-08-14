import { useEffect, useState } from 'react'
import { FileText, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { extractFieldErrors, getErrorMessage, type FieldErrors } from '@/lib/pocketbase/errors'
import { getPageSettings, savePageSettings } from '@/services/page-settings'

type PageKey = 'construtoras' | 'concreteiras'

const PAGES: { value: PageKey; label: string; hasSubtitle: boolean }[] = [
  { value: 'construtoras', label: 'Página de Construtoras', hasSubtitle: false },
  { value: 'concreteiras', label: 'Página de Concreteiras', hasSubtitle: true },
]

interface FormState {
  title: string
  description: string
  subtitle: string
}

const EMPTY: FormState = { title: '', description: '', subtitle: '' }

export default function PageSettingsPage() {
  const { toast } = useToast()
  const [selectedPage, setSelectedPage] = useState<PageKey>('construtoras')
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    setLoading(true)
    setFieldErrors({})
    getPageSettings(selectedPage)
      .then((settings) => {
        if (settings) {
          setForm({
            title: settings.title || '',
            description: settings.description || '',
            subtitle: settings.subtitle || '',
          })
        } else {
          setForm(EMPTY)
        }
      })
      .catch(() => {
        setForm(EMPTY)
        toast({ title: 'Erro ao carregar configurações', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }, [selectedPage, toast])

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSave = async () => {
    setSaving(true)
    setFieldErrors({})
    try {
      await savePageSettings(selectedPage, form)
      toast({ title: 'Configurações salvas com sucesso!' })
    } catch (error: any) {
      const errors = extractFieldErrors(error)
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        toast({
          title: 'Erro de validação',
          description: Object.values(errors).join(', '),
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro ao salvar',
          description: getErrorMessage(error),
          variant: 'destructive',
        })
      }
    } finally {
      setSaving(false)
    }
  }

  const currentMeta = PAGES.find((p) => p.value === selectedPage)!

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Configurações das Páginas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Edite o título e a descrição geral das páginas públicas de Construtoras e Concreteiras.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Selecionar Página</CardTitle>
          <CardDescription>Escolha qual página deseja editar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="page-select">Página</Label>
            <Select
              value={selectedPage}
              onValueChange={(value) => setSelectedPage(value as PageKey)}
              disabled={loading}
            >
              <SelectTrigger id="page-select">
                <SelectValue placeholder="Selecione uma página" />
              </SelectTrigger>
              <SelectContent>
                {PAGES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentMeta.label}</CardTitle>
          <CardDescription>
            Os textos abaixo aparecem no topo da página pública correspondente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Título da página"
                />
                {fieldErrors.title && <p className="text-sm text-red-500">{fieldErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descrição geral da página"
                  rows={4}
                />
                {fieldErrors.description && (
                  <p className="text-sm text-red-500">{fieldErrors.description}</p>
                )}
              </div>

              {currentMeta.hasSubtitle && (
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtítulo da seção de escopo</Label>
                  <Input
                    id="subtitle"
                    value={form.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="Ex.: Escopo dos Serviços de Consultoria"
                  />
                  {fieldErrors.subtitle && (
                    <p className="text-sm text-red-500">{fieldErrors.subtitle}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button onClick={handleSave} disabled={saving} className="min-w-[180px] shadow-sm">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Configuração
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
