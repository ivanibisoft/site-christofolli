import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, Loader2, ImagePlus, X } from 'lucide-react'
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
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { getGalleryItem, createGalleryItem, updateGalleryItem } from '@/services/gallery'
import { getGalleryCategories, type GalleryCategory } from '@/services/gallery-categories'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import pb from '@/lib/pocketbase/client'

const formSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  category_id: z.string().min(1, 'A categoria é obrigatória'),
  description: z.string().optional(),
})

export default function GalleryForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id && id !== 'new'
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(!!isEditing)
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category_id: '',
      description: '',
    },
  })

  useEffect(() => {
    getGalleryCategories()
      .then(setCategories)
      .catch(() => {
        toast({ title: 'Erro ao carregar categorias', variant: 'destructive' })
      })
      .finally(() => setCategoriesLoading(false))
  }, [toast])

  useEffect(() => {
    if (isEditing) {
      getGalleryItem(id!)
        .then((item) => {
          form.reset({
            title: item.title,
            category_id: item.category_id || '',
            description: item.description || '',
          })
          if (item.image) {
            setCurrentImageUrl(pb.files.getUrl(item, item.image))
          }
        })
        .catch(() => {
          toast({ title: 'Item não encontrado', variant: 'destructive' })
          navigate('/admin/gallery')
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, form, navigate, toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selected)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isEditing && !file) {
      toast({ title: 'Selecione uma imagem', variant: 'destructive' })
      return
    }

    setSaving(true)
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('category_id', values.category_id)
    if (values.description) {
      formData.append('description', values.description)
    }
    if (file) {
      formData.append('image', file)
    }

    try {
      if (isEditing) {
        await updateGalleryItem(id!, formData)
        toast({ title: 'Item atualizado com sucesso!' })
      } else {
        await createGalleryItem(formData)
        toast({ title: 'Item adicionado com sucesso!' })
      }
      navigate('/admin/gallery')
    } catch (error) {
      const fieldErrors = extractFieldErrors(error)
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          form.setError(field as any, { message: msg })
        })
      } else {
        toast({ title: 'Erro ao salvar os dados', variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading || categoriesLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p>Carregando informações...</p>
      </div>
    )
  }

  const displayImage = preview || currentImageUrl

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="shrink-0 bg-white shadow-sm">
          <Link to="/admin/gallery">
            <ArrowLeft className="h-4 w-4 text-slate-600" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {isEditing ? 'Editar Imagem' : 'Nova Imagem'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isEditing
              ? 'Atualize os detalhes da imagem na galeria.'
              : 'Adicione uma nova imagem ao portfólio.'}
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 sm:p-8 space-y-8">
              <div className="space-y-4">
                <FormLabel className="text-slate-800">
                  Imagem da Galeria {!isEditing && <span className="text-red-500">*</span>}
                </FormLabel>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-6 transition-colors hover:bg-slate-100">
                  {displayImage ? (
                    <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden border bg-white shadow-sm">
                      <img
                        src={displayImage}
                        alt="Preview"
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
                      <p className="text-sm font-medium text-slate-700">
                        Nenhuma imagem selecionada
                      </p>
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        Formatos suportados: JPG, PNG, WebP (Máx. 5MB)
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {displayImage ? 'Trocar Imagem' : 'Selecionar Imagem'}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
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
                          placeholder="Ex: Ensaio de Compressão..."
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
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">
                        Categoria <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-50 focus:bg-white">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <FormLabel className="text-slate-800">Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Adicione mais detalhes sobre a imagem..."
                        className="min-h-[120px] resize-y bg-slate-50 focus:bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                asChild
                disabled={saving}
                className="text-slate-600 hover:text-slate-900"
              >
                <Link to="/admin/gallery">Cancelar</Link>
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
                    Salvar Imagem
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
