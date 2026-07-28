import { useState, useEffect } from 'react'
import { Server, Loader2, Save, Send, Mail, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import {
  getSmtpSettings,
  saveSmtpSettings,
  testSmtpSettings,
  type SmtpSettings,
} from '@/services/smtp-settings'

export default function SmtpSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [settings, setSettings] = useState<SmtpSettings>({
    host: '',
    port: 587,
    username: '',
    password: '',
    encryption: 'TLS',
    from_email: '',
    from_name: 'Christófolli Consultoria',
  })

  useEffect(() => {
    getSmtpSettings()
      .then((data) => setSettings(data))
      .catch(() => toast({ title: 'Erro ao carregar configurações', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }, [toast])

  const handleChange = (field: keyof SmtpSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveSmtpSettings(settings)
      toast({ title: 'Configurações salvas com sucesso!' })
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error?.message || 'Erro desconhecido',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      const result = await testSmtpSettings(settings)
      if (result.success) {
        toast({ title: 'Teste enviado com sucesso!' })
      } else {
        toast({
          title: 'Falha no teste',
          description: result.error || 'Erro desconhecido',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Erro de conexão',
        description: error?.message || 'Verifique o servidor e tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Configuração Nativa PocketBase</AlertTitle>
        <AlertDescription>
          As credenciais SMTP são salvas diretamente nas configurações nativas do PocketBase
          (Settings → Mail). Todos os e-mails do sistema utilizam esta configuração.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Credenciais SMTP
          </CardTitle>
          <CardDescription>
            Configure o servidor de e-mail para auto-resposta e notificações.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Servidor SMTP</Label>
              <Input
                id="host"
                value={settings.host}
                onChange={(e) => handleChange('host', e.target.value)}
                placeholder="smtp.exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Porta</Label>
              <Input
                id="port"
                type="number"
                value={settings.port}
                onChange={(e) => handleChange('port', parseInt(e.target.value) || 587)}
                placeholder="587"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                value={settings.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="usuario@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={settings.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="encryption">Criptografia</Label>
            <select
              id="encryption"
              className="w-full rounded-md border border-slate-200 bg-slate-50 focus:bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={settings.encryption}
              onChange={(e) => handleChange('encryption', e.target.value)}
            >
              <option value="TLS">TLS</option>
              <option value="none">Nenhuma</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_email">E-mail Remetente</Label>
              <Input
                id="from_email"
                type="email"
                value={settings.from_email}
                onChange={(e) => handleChange('from_email', e.target.value)}
                placeholder="noreply@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from_name">Nome do Remetente</Label>
              <Input
                id="from_name"
                value={settings.from_name}
                onChange={(e) => handleChange('from_name', e.target.value)}
                placeholder="Christófolli Consultoria"
              />
            </div>
          </div>

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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Testar Conexão
          </CardTitle>
          <CardDescription>
            Envie um e-mail de teste para o endereço remetente configurado acima.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing}
              className="min-w-[180px] shadow-sm"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Testar Conexão
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
