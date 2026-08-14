import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, Loader2, Check, ChevronsUpDown } from 'lucide-react'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import {
  getBuilderService,
  createBuilderService,
  updateBuilderService,
} from '@/services/builder-services'
import { getCustomIcons, type CustomIcon } from '@/services/custom-icons'
import { getLucideIcon } from '@/lib/lucide-icons'
import { extractFieldErrors } from '@/lib/pocketbase/errors'

const formSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  topics: z.string().optional(),
  icon: z.string().optional(),
  order: z.coerce.number().int().optional(),
})

export default function BuilderServiceForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id && id !== 'new'
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(!!isEditing)
  const [saving, setSaving] = useState(false)
  const [icons, setIcons] = useState<CustomIcon[]>([])
  const [iconOpen, setIconOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      topics: '',
      icon: '',
      order: 0,
    },
  })

  useEffect(() => {
    getCustomIcons().then(setIcons).catch(console.error)
  }, [])

  useEffect(() => {
    if (isEditing) {
      getBuilderService(id!)
        .then((item) => {
          form.reset({
            title: item.title,
            description: item.description ?? '',
            topics: item.topics ?? '',
            icon: item.icon ?? '',
            order: item.order ?? 0,
          })
        })
        .catch(() => {
          toast({ title: 'Item não encontrado', variant: 'destructive' })
          navigate('/admin/builder-services')
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, form, navigate, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSaving(true)
    try {
      const data = {
        title: values.title,
        description: values.description ?? '',
        topics: values.topics ?? '',
        icon: values.icon ?? '',
        order: values.order ?? 0,
      }
      if (isEditing) {
        await updateBuilderService(id!, data)
        toast({ title: 'Serviço atualizado com sucesso!' })
      } else {
        await createBuilderService(data)
        toast({ title: 'Serviço adicionado com sucesso!' })
      }
      navigate('/admin/builder-services')
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

  const selectedIconName = form.watch('icon')
  const selectedIcon = icons.find((i) => i.name === selectedIconName)
  const SelectedLucideIcon = getLucideIcon(selectedIconName)

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="shrink-0 bg-white shadow-sm">
          <Link to="/admin/builder-services">
            <ArrowLeft className="h-4 w-4 text-slate-600" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isEditing
              ? 'Atualize os detalhes do serviço para construtoras.'
              : 'Adicione um novo serviço para construtoras.'}
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 sm:p-8 space-y-6">
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
                        placeholder="Ex: Concretos Especiais (CAD/CAA)..."
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Breve descrição do serviço..."
                        className="min-h-[80px] resize-y bg-slate-50 focus:bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">Tópicos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Um tópico por linha..."
                        className="min-h-[200px] resize-y bg-slate-50 focus:bg-white"
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
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Ícone</FormLabel>
                      <Popover open={iconOpen} onOpenChange={setIconOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between bg-slate-50 focus:bg-white font-normal',
                                !field.value && 'text-slate-400',
                              )}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                {field.value ? (
                                  <>
                                    <SelectedLucideIcon className="h-4 w-4 shrink-0 text-primary" />
                                    <span className="truncate">
                                      {selectedIcon?.label ?? field.value}
                                    </span>
                                  </>
                                ) : (
                                  'Selecione um ícone'
                                )}
                              </span>
                              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput placeholder="Buscar ícone..." />
                            <CommandList>
                              <CommandEmpty>Nenhum ícone encontrado.</CommandEmpty>
                              <CommandGroup>
                                {icons.map((icon) => {
                                  const Icon = getLucideIcon(icon.name)
                                  return (
                                    <CommandItem
                                      key={icon.id}
                                      value={`${icon.name} ${icon.label}`}
                                      onSelect={() => {
                                        field.onChange(icon.name)
                                        setIconOpen(false)
                                      }}
                                      className="gap-2"
                                    >
                                      <Icon className="h-4 w-4 text-primary" />
                                      <span className="font-mono text-xs">{icon.name}</span>
                                      <span className="text-slate-500 text-xs">— {icon.label}</span>
                                      {field.value === icon.name && (
                                        <Check className="h-4 w-4 ml-auto" />
                                      )}
                                    </CommandItem>
                                  )
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                asChild
                disabled={saving}
                className="text-slate-600 hover:text-slate-900"
              >
                <Link to="/admin/builder-services">Cancelar</Link>
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
                    Salvar Serviço
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
