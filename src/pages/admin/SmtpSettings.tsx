import { useEffect, useState } from 'react'
import { Server, Save, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getSmtpSettings,
  updateSmtpSettings,
  createSmtpSettings,
  testSmtpSettings,
} from '@/services/smtp-settings'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'

export default function SmtpSettingsPage() {
  const { toast } = useToast()
  const [settingsId, setSettingsId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    host: '',
    port: '587',
    username: '',
    password: '',
    encryption: 'TLS',
    from_email: '',
    from_name: '',
  })

  const loadSettings = async () => {
    try {
      const settings = await getSmtpSettings()
      if (settings) {
        setSettingsId(settings.id)
        setForm({
          host: settings.host || '',
          port: String(settings.port || '587'),
          username: settings.username || '',
          password: settings.password || '',
          encryption: settings.encryption || 'TLS',
          from_email: settings.from_email || '',
          from_name: settings.from_name || '',
        })
      }
    } catch {
      toast({ title: 'Erro ao carregar configurações', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  useRealtime('smtp_settings', () => {
    loadSettings()
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setFieldErrors({})
    try {
      const data = { ...form, port: Number(form.port) }
      if (settingsId) {
        await updateSmtpSettings(settingsId, data)
      } else {
        const created = await createSmtpSettings(data)
        setSettingsId(created.id)
      }
      toast({ title: 'Configurações de e-mail salvas com sucesso!' })
    } catch (error) {
      setFieldErrors(extractFieldErrors(error))
      toast({ title: 'Erro ao salvar configurações', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      const data = { ...form, port: Number(form.port) }
      const result = await testSmtpSettings(data)
      if (result.success) {
        toast({
          title: 'E-mail de teste enviado com sucesso!',
          description: `Verifique a caixa de entrada de ${form.from_email}.`,
        })
      } else {
        toast({
          title: 'Falha no teste de configuração',
          description: result.error || 'Erro desconhecido',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.error || error?.message || 'Erro ao testar configuração SMTP'
      toast({
        title: 'Falha no teste de configuração',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p>Carregando configurações...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Server className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Configurações de E-mail
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure o servidor SMTP para envio de e-mails do sistema.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Servidor SMTP</CardTitle>
          <CardDescription>
            Os e-mails de notificação e auto-resposta serão enviados através deste servidor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Servidor SMTP</Label>
              <Input
                id="host"
                value={form.host}
                onChange={(e) => handleChange('host', e.target.value)}
                placeholder="smtp.gmail.com"
              />
              {fieldErrors.host && <p className="text-sm text-red-500">{fieldErrors.host}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Porta</Label>
              <Input
                id="port"
                type="number"
                value={form.port}
                onChange={(e) => handleChange('port', e.target.value)}
                placeholder="587"
              />
              {fieldErrors.port && <p className="text-sm text-red-500">{fieldErrors.port}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="usuario@dominio.com"
              />
              {fieldErrors.username && (
                <p className="text-sm text-red-500">{fieldErrors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <p className="text-sm text-red-500">{fieldErrors.password}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Criptografia</Label>
            <Select value={form.encryption} onValueChange={(v) => handleChange('encryption', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SSL">SSL</SelectItem>
                <SelectItem value="TLS">TLS</SelectItem>
                <SelectItem value="None">Nenhuma</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.encryption && (
              <p className="text-sm text-red-500">{fieldErrors.encryption}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_email">E-mail do Remetente</Label>
              <Input
                id="from_email"
                type="email"
                value={form.from_email}
                onChange={(e) => handleChange('from_email', e.target.value)}
                placeholder="noreply@dominio.com"
              />
              {fieldErrors.from_email && (
                <p className="text-sm text-red-500">{fieldErrors.from_email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="from_name">Nome do Remetente</Label>
              <Input
                id="from_name"
                value={form.from_name}
                onChange={(e) => handleChange('from_name', e.target.value)}
                placeholder="Christófolli Consultoria"
              />
              {fieldErrors.from_name && (
                <p className="text-sm text-red-500">{fieldErrors.from_name}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={handleTest}
              disabled={testing || saving}
              variant="outline"
              className="min-w-[140px] shadow-sm"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Testar Configuração
                </>
              )}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || testing}
              className="min-w-[140px] shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
