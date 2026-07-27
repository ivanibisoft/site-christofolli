import { useState } from 'react'
import { Server, Loader2, Send, Mail, Info, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { testSmtpSettings } from '@/services/smtp-settings'

export default function SmtpSettingsPage() {
  const { toast } = useToast()
  const [testing, setTesting] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  const handleTest = async () => {
    setTesting(true)
    try {
      const result = await testSmtpSettings({ to: testEmail || undefined })
      if (result.success) {
        toast({
          title: 'E-mail de teste enviado com sucesso!',
          description: result.message || 'Verifique a caixa de entrada.',
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
        <AlertTitle>Configuração via Painel PocketBase</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            As configurações de SMTP agora são gerenciadas nativamente pelo PocketBase. Acesse o
            painel administrativo do PocketBase em <strong>Settings → Mail</strong> para configurar
            o servidor SMTP (host, porta, usuário, senha e criptografia).
          </p>
          <p>
            Todos os e-mails do sistema (auto-resposta, notificação de contatos e notificação de
            publicações) utilizam essa configuração nativa.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Testar Configuração
          </CardTitle>
          <CardDescription>
            Envie um e-mail de teste para verificar se o SMTP está funcionando corretamente.
            Certifique-se de que as configurações foram salvas em Settings → Mail no PocketBase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test_email">E-mail para teste (opcional)</Label>
            <Input
              id="test_email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Deixe vazio para usar o remetente padrão"
            />
            <p className="text-xs text-slate-500">
              Se não preenchido, o e-mail será enviado para o endereço do remetente configurado no
              PocketBase.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleTest} disabled={testing} className="min-w-[180px] shadow-sm">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
