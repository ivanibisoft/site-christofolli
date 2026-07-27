import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  Save,
  Loader2,
  UploadCloud,
  X,
  FileText,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
import {
  getPublication,
  createPublication,
  updatePublication,
  notifyPublicationContacts,
} from '@/services/publications'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { getFileUrl } from '@/lib/file-url'

const formSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  published_date: z.string().optional(),
  category: z.string().optional(),
})

export default function PublicationForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id && id !== 'new'
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [existingCover, setExistingCover] = useState<string | null>(null)
  const [removeExistingCover, setRemoveExistingCover] = useState(false)
  const [coverError, setCoverError] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [existingPdf, setExistingPdf] = useState<{ url: string; name: string } | null>(null)
  const [removeExistingPdf, setRemoveExistingPdf] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      published_date: '',
      category: 'Technical',
    },
  })

  useEffect(() => {
    if (isEditing) {
      getPublication(id!)
        .then((pub) => {
          form.reset({
            title: pub.title,
            description: pub.description || '',
            published_date: pub.published_date ? pub.published_date.substring(0, 10) : '',
            category: pub.category || 'Technical',
          })
          if (pub.pdf_file) {
            setExistingPdf({
              url: getFileUrl(pub, pub.pdf_file),
              name: pub.pdf_file,
            })
          }
          if (pub.cover_image) {
            setExistingCover(pub.cover_image)
          }
        })
        .catch(() => {
          toast({ title: 'Publicação não encontrada', variant: 'destructive' })
          navigate('/admin/publications')
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, form, navigate, toast])

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        setCoverError('Apenas arquivos de imagem são permitidos.')
        toast({
          title: 'Formato inválido',
          description: 'Apenas arquivos de imagem são permitidos.',
          variant: 'destructive',
        })
        if (coverInputRef.current) coverInputRef.current.value = ''
        return
      }
      if (file.size > 5242880) {
        setCoverError('O tamanho máximo permitido é 5MB.')
        toast({
          title: 'Arquivo muito grande',
          description: 'O tamanho máximo permitido é 5MB.',
          variant: 'destructive',
        })
        if (coverInputRef.current) coverInputRef.current.value = ''
        return
      }
      setCoverError(null)
      setCoverImage(file)
      setRemoveExistingCover(false)
    }
  }

  const handleRemoveCover = () => {
    setCoverImage(null)
    setCoverError(null)
    if (coverInputRef.current) coverInputRef.current.value = ''
    if (existingCover) setRemoveExistingCover(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const isPdf =
        file.type === 'application/pdf' ||
        file.type === 'application/x-pdf' ||
        file.name.toLowerCase().endsWith('.pdf')
      if (!isPdf) {
        setFileError('Apenas arquivos PDF são permitidos.')
        toast({
          title: 'Formato inválido',
          description: 'Apenas arquivos PDF são permitidos.',
          variant: 'destructive',
        })
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      if (file.size > 52428800) {
        setFileError('O tamanho máximo permitido é 50MB.')
        toast({
          title: 'Arquivo muito grande',
          description: 'O tamanho máximo permitido é 50MB.',
          variant: 'destructive',
        })
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      setFileError(null)
      setPdfFile(file)
      setRemoveExistingPdf(false)
    }
  }

  const handleRemoveFile = () => {
    setPdfFile(null)
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (existingPdf) {
      setRemoveExistingPdf(true)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFileError(null)
    setSaving(true)

    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('description', values.description || '')
    formData.append('category', values.category || 'Technical')
    if (values.published_date) {
      formData.append(
        'published_date',
        new Date(`${values.published_date}T12:00:00Z`).toISOString(),
      )
    } else {
      formData.append('published_date', '')
    }

    if (coverImage) {
      formData.append('cover_image', coverImage)
    } else if (removeExistingCover) {
      formData.append('cover_image', '')
    }

    if (pdfFile) {
      formData.append('pdf_file', pdfFile)
    } else if (removeExistingPdf) {
      formData.append('pdf_file', '')
    }

    try {
      const savedPub = isEditing
        ? await updatePublication(id!, formData)
        : await createPublication(formData)
      const pubId = savedPub?.id || id || ''

      if (values.category === 'Blog' && pubId) {
        try {
          const result = await notifyPublicationContacts(pubId)
          if (result.success) {
            toast({ title: `E‑mails enviados para ${result.count} contatos com sucesso!` })
          } else {
            toast({
              title: `Erro ao enviar e‑mails: ${result.error || 'Erro desconhecido'}`,
              variant: 'destructive',
            })
          }
        } catch (notifyError) {
          const reason = notifyError instanceof Error ? notifyError.message : 'Erro desconhecido'
          toast({
            title: `Erro ao enviar e‑mails: ${reason}`,
            variant: 'destructive',
          })
        }
      } else {
        toast({
          title: isEditing
            ? 'Publicação atualizada com sucesso!'
            : 'Publicação cadastrada com sucesso!',
        })
      }

      navigate('/admin/publications')
    } catch (error) {
      const fieldErrors = extractFieldErrors(error)
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          if (field === 'cover_image') {
            setCoverError(msg as string)
            toast({
              title: 'Erro na imagem de capa',
              description: msg as string,
              variant: 'destructive',
            })
          } else if (field === 'pdf_file') {
            setFileError(msg as string)
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
              <FormLabel className="text-slate-800">Imagem de Capa</FormLabel>
              {!coverImage && (!existingCover || removeExistingCover) ? (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Clique para selecionar uma imagem de capa
                  </p>
                  <p className="text-xs text-slate-500 mb-4">JPG, PNG ou WebP — Máx 5MB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    Procurar imagem
                  </Button>
                  <input
                    type="file"
                    ref={coverInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleCoverChange}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    'flex items-center justify-between p-3 border rounded-lg transition-colors',
                    coverImage ? 'bg-green-50 border-green-200' : 'bg-slate-50',
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                        coverImage ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500',
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {coverImage ? coverImage.name : existingCover}
                      </p>
                      <p
                        className={cn(
                          'text-xs',
                          coverImage ? 'text-green-600 font-medium' : 'text-slate-500',
                        )}
                      >
                        {coverImage
                          ? `${(coverImage.size / 1024 / 1024).toFixed(2)} MB — imagem selecionada`
                          : 'Imagem salva no servidor'}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveCover}
                    className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remover imagem</span>
                  </Button>
                </div>
              )}
              <FormDescription>
                A imagem de capa será exibida nos cards de publicação na página inicial.
              </FormDescription>
              {coverError && <p className="text-sm font-medium text-destructive">{coverError}</p>}
            </div>

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
                <div
                  className={cn(
                    'flex items-center justify-between p-3 border rounded-lg transition-colors',
                    pdfFile ? 'bg-green-50 border-green-200' : 'bg-slate-50',
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                        pdfFile ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600',
                      )}
                    >
                      {pdfFile ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {currentFileName}
                      </p>
                      <p
                        className={cn(
                          'text-xs',
                          pdfFile ? 'text-green-600 font-medium' : 'text-slate-500',
                        )}
                      >
                        {pdfFile
                          ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB — arquivo selecionado`
                          : 'Arquivo salvo no servidor'}
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
                O arquivo PDF é opcional. Você pode cadastrá-lo agora ou adicioná-lo posteriormente.
              </FormDescription>
              {fileError && <p className="text-sm font-medium text-destructive">{fileError}</p>}
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800">Categoria</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border border-slate-200 bg-slate-50 focus:bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      {...field}
                    >
                      <option value="Technical">Técnica</option>
                      <option value="Blog">Blog</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Selecione "Blog" para exibir na página inicial ou "Técnica" para a página Sobre.
                  </FormDescription>
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
