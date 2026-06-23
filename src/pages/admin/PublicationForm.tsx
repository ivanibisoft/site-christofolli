import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
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

const formSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  link: z
    .string()
    .url('Deve ser uma URL válida começando com http:// ou https://')
    .min(1, 'O link é obrigatório'),
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
            link: pub.link,
            description: pub.description || '',
            published_date: pub.published_date ? pub.published_date.substring(0, 10) : '',
          })
        })
        .catch(() => {
          toast({ title: 'Publicação não encontrada', variant: 'destructive' })
          navigate('/admin/publications')
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, form, navigate, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSaving(true)

    const payload = {
      ...values,
      published_date: values.published_date
        ? new Date(`${values.published_date}T12:00:00Z`).toISOString()
        : '',
    }

    try {
      if (isEditing) {
        await updatePublication(id!, payload)
        toast({ title: 'Publicação atualizada com sucesso!' })
      } else {
        await createPublication(payload)
        toast({ title: 'Publicação cadastrada com sucesso!' })
      }
      navigate('/admin/publications')
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

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p>Carregando informações da publicação...</p>
      </div>
    )
  }

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

            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">
                      Link de Acesso (DOI ou URL) <span className="text-red-500">*</span>
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
