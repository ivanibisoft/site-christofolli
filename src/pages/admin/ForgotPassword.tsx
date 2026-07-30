import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import pb from '@/lib/pocketbase/client'

const formSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export default function ForgotPassword() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  if (loading) return null
  if (isAuthenticated) return <Navigate to="/admin" replace />

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    setErrorMessage('')
    try {
      await pb.collection('users').requestPasswordReset(values.email)
      setSuccess(true)
    } catch {
      setErrorMessage(
        'Não foi possível enviar o link de recuperação. Verifique o e-mail informado e tente novamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      <Button variant="ghost" asChild className="absolute top-4 left-4 text-slate-500">
        <Link to="/admin/login">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao site
        </Link>
      </Button>

      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-base">
            Informe seu e-mail para receber um link de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-6 text-center">
              <p className="text-slate-600 text-sm leading-relaxed">
                Um link de redefinição de senha foi enviado para o seu e-mail.
              </p>
              <Button onClick={() => navigate('/admin/login')} className="w-full h-11 text-base">
                Voltar para o login
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@exemplo.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar link de recuperação'
                  )}
                </Button>
              </form>
            </Form>
          )}
          {!success && (
            <div className="mt-6 text-center">
              <Link
                to="/admin/login"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Voltar para o login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
