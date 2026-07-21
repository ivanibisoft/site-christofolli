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
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  getTimelineItem,
  createTimelineItem,
  updateTimelineItem,
  getTimelineItems,
} from '@/services/timeline-items'
import { extractFieldErrors } from '@/lib/pocketbase/errors'

const formSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  institution: z.string().min(1, 'A instituição é obrigatória'),
  description: z.string().optional(),
  period: z.string().optional(),
  type: z.enum(['professional', 'academic'], {
    errorMap: () => ({ message: 'Selecione o tipo' }),
  }),
  order: z.coerce.number().int().min(0, 'A ordem deve ser maior ou igual a 0'),
})

export default function TimelineForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id && id !== 'new'
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(!!isEditing)
  const [saving, setSaving] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      institution: '',
      description: '',
      period: '',
      type: 'professional',
      order: 0,
    },
  })

  useEffect(() => {
    if (isEditing) {
      getTimelineItem(id!)
        .then((item) => {
          form.reset({
            title: item.title,
            institution: item.institution,
            description: item.description ?? '',
            period: item.period ?? '',
            type: item.type,
            order: item.order ?? 0,
          })
        })
        .catch(() => {
          toast({ title: 'Item não encontrado', variant: 'destructive' })
          navigate('/admin/timeline')
        })
        .finally(() => setLoading(false))
    } else {
      getTimelineItems()
        .then((items) => {
          form.setValue('order', items.length + 1)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, form, navigate, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSaving(true)
    try {
      const data = {
        title: values.title,
        institution: values.institution,
        description: values.description ?? '',
        period: values.period ?? '',
        type: values.type,
        order: values.order,
      }
      if (isEditing) {
        await updateTimelineItem(id!, data)
        toast({ title: 'Item atualizado com sucesso!' })
      } else {
        await createTimelineItem(data)
        toast({ title: 'Item adicionado com sucesso!' })
      }
      navigate('/admin/timeline')
    } catch (error) {
      const fieldErrors = extractFieldErrors(error)
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          form.setError(field as keyof typeof formSchema, { message: msg })
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="shrink-0 bg-white shadow-sm">
          <Link to="/admin/timeline">
            <ArrowLeft className="h-4 w-4 text-slate-600" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {isEditing ? 'Editar Item' : 'Novo Item'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isEditing
              ? 'Atualize os detalhes do item da trajetória.'
              : 'Adicione um novo item à trajetória profissional ou acadêmica.'}
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 sm:p-8 space-y-6">
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
                          placeholder="Ex: Doutorado em Construção Civil..."
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
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">
                        Instituição <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Universidade Federal do Paraná..."
                          className="bg-slate-50 focus:bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Período</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 2015 - 2020"
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">
                        Tipo <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-50 focus:bg-white">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Profissional</SelectItem>
                          <SelectItem value="academic">Acadêmico</SelectItem>
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
                        placeholder="Descreva as atividades, conquistas ou detalhes..."
                        className="min-h-[120px] resize-y bg-slate-50 focus:bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">Ordem de Exibição</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-slate-50 focus:bg-white"
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
                <Link to="/admin/timeline">Cancelar</Link>
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
                    Salvar Item
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
