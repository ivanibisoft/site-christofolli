import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, Loader2, UploadCloud, X, FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { getPublication, createPublication, updatePublication } from '@/services/publications'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import pb from '@/lib/pocketbase/client'

const formSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  link: z.string().optional(),
  description: z.string().optional(),
  published_date: z.string().optional(),
})

export default function PublicationForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id && id !== 'new'
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [existingPdf, setExistingPdf] = useState<{ url: string; name: string } | null>(null)
  const [removeExistingPdf, setRemoveExistingPdf] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      link: '',
      description: '',
      published_date: '',
    },
  })

  useEffect(() => {
    if (isEditing) {
      getPublication(id!)
        .then((pub) => {
          form.reset({
            title: pub.title,
            link: pub.link || '',
            description: pub.description || '',
            published_date: pub.published_date ? pub.published_date.substring(0, 10) : '',
          })
          if (pub.pdf_file) {
            setExistingPdf({
              url: pb.files.getUrl(pub as any, pub.pdf_file),
              name: pub.pdf_file,
            })
          }
        })
        .catch(() => {
          toast({ title: 'Publicação não encontrada', variant: 'destructive' })
          navigate('/admin/publications')
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, form, navigate, toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Formato inválido',
          description: 'Por favor, selecione um arquivo PDF.',
          variant: 'destructive',
        })
        return
      }
      if (file.size > 52428800) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O tamanho máximo permitido é 50MB.',
          variant: 'destructive',
        })
        return
      }
      setPdfFile(file)
      setRemoveExistingPdf(false)
      form.clearErrors('link')
    }
  }

  const handleRemoveFile = () => {
    setPdfFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (existingPdf) {
      setRemoveExistingPdf(true)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const hasLink = !!values.link?.trim()
    const hasPdf = !!pdfFile || (!!existingPdf && !removeExistingPdf)

    if (!hasLink && !hasPdf) {
      form.setError('link', {
        message: 'Por favor, forneça um link de acesso ou anexe um arquivo PDF.',
      })
      return
    }

    setSaving(true)

    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('link', values.link || '')
    formData.append('description', values.description || '')
    if (values.published_date) {
      formData.append(
        'published_date',
        new Date(`${values.published_date}T12:00:00Z`).toISOString(),
      )
    } else {
      formData.append('published_date', '')
    }

    if (pdfFile) {
      formData.append('pdf_file', pdfFile)
    } else if (removeExistingPdf) {
      formData.append('pdf_file', '')
    }

    try {
      if (isEditing) {
        await updatePublication(id!, formData)
        toast({ title: 'Publicação atualizada com sucesso!' })
      } else {
        await createPublication(formData)
        toast({ title: 'Publicação cadastrada com sucesso!' })
      }
      navigate('/admin/publications')
    } catch (error) {
      const fieldErrors = extractFieldErrors(error)
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          if (field === 'pdf_file') {
            toast({
              title: 'Erro no arquivo PDF',
              description: msg as string,
              variant: 'destructive',
            })
          } else {
            form.setError(field as any, { message: msg as string })
          }
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
        <p>Carregando informações da publicação...</p>
      </div>
    )
  }

  const showFileUploader = !pdfFile && (!existingPdf || removeExistingPdf)
  const currentFileName = pdfFile
    ? pdfFile.name
    : existingPdf && !removeExistingPdf
      ? existingPdf.name
      : ''

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="shrink-0 bg-white shadow-sm">
          <Link to="/admin/publications">
            <ArrowLeft className="h-4 w-4 text-slate-600" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {isEditing ? 'Editar Publicação' : 'Nova Publicação'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isEditing
              ? 'Atualize os dados do seu artigo ou trabalho técnico.'
              : 'Preencha os dados do novo artigo ou trabalho técnico.'}
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800">
                    Título <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Use of high-energy milling for reducing CO2 emissions..."
                      className="bg-slate-50 focus:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel className="text-slate-800">Arquivo PDF</FormLabel>
              {showFileUploader ? (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Clique para selecionar um arquivo PDF
                  </p>
                  <p className="text-xs text-slate-500 mb-4">Tamanho máximo: 50MB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Procurar arquivo
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-10 w-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {currentFileName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {pdfFile
                          ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB`
                          : 'Arquivo salvo'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-2">
                    {existingPdf && !removeExistingPdf && !pdfFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 text-slate-500"
                      >
                        <a href={existingPdf.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover arquivo</span>
                    </Button>
                  </div>
                </div>
              )}
              <FormDescription>
                Se um arquivo for enviado, o Link de Acesso não será obrigatório.
              </FormDescription>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">
                      Link de Acesso (DOI ou URL){' '}
                      {!pdfFile && (!existingPdf || removeExistingPdf) && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://doi.org/..."
                        className="bg-slate-50 focus:bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">Data de Publicação</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-slate-50 focus:bg-white text-slate-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800">Descrição ou Resumo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva brevemente o conteúdo principal do artigo..."
                      className="min-h-[140px] resize-y bg-slate-50 focus:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Pode ser usado para exibir informações adicionais, coautores ou contexto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <Button
                variant="ghost"
                asChild
                disabled={saving}
                className="text-slate-600 hover:text-slate-900"
              >
                <Link to="/admin/publications">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={saving} className="min-w-[140px] shadow-sm">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Publicação
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
