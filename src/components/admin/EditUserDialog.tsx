import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { updateUser } from '@/services/users'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import type { User } from '@/services/users'

const formSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  role: z.string(),
  password: z.string().optional(),
})

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
  user: User | null
  currentUserId: string
  existingEmails: string[]
}

export function EditUserDialog({
  open,
  onOpenChange,
  onSaved,
  user,
  currentUserId,
  existingEmails,
}: EditUserDialogProps) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: user?.role ?? 'user',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return

    const isSelf = user.id === currentUserId
    if (isSelf && user.role === 'admin' && values.role !== 'admin') {
      toast({ title: 'Você não pode rebaixar a si mesmo', variant: 'destructive' })
      return
    }

    const otherEmails = existingEmails.filter((e) => e !== user.email?.toLowerCase())
    if (otherEmails.includes(values.email.toLowerCase())) {
      form.setError('email', { message: 'Este e-mail já está em uso' })
      return
    }

    setSaving(true)
    try {
      const data: Record<string, string> = {
        name: values.name,
        email: values.email,
        role: values.role,
      }
      if (values.password && values.password.length > 0) {
        data.password = values.password
        data.passwordConfirm = values.password
      }
      await updateUser(user.id, data)
      toast({ title: 'Usuário atualizado com sucesso!' })
      form.reset({
        name: values.name,
        email: values.email,
        role: values.role,
        password: '',
      })
      onOpenChange(false)
      onSaved()
    } catch (error) {
      const fieldErrors = extractFieldErrors(error)
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          form.setError(field as keyof typeof formSchema, { message: msg })
        })
      } else {
        toast({ title: 'Erro ao atualizar usuário', variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  const isSelf = user?.id === currentUserId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize os dados do usuário. Deixe a senha em branco para mantê-la.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSelf}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                  {isSelf && (
                    <p className="text-xs text-slate-500">
                      Você não pode alterar sua própria função.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha (opcional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Deixe em branco para manter"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="min-w-[120px]">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
