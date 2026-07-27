import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Trash2, Eye, Mail, Building2, Phone, MessageSquare, User } from 'lucide-react'
import { getContacts, deleteContact, type Contact } from '@/services/contacts'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const loadContacts = async () => {
    try {
      const data = await getContacts()
      setContacts(data)
    } catch {
      toast({ title: 'Erro', description: 'Falha ao carregar contatos.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  useRealtime('contacts', () => {
    loadContacts()
  })

  const handleDelete = async () => {
    if (!contactToDelete) return
    setDeleting(true)
    try {
      await deleteContact(contactToDelete.id)
      setContacts((prev) => prev.filter((c) => c.id !== contactToDelete.id))
      toast({ title: 'Sucesso', description: 'Contato excluído com sucesso.' })
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o contato.',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
      setContactToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin mb-3" />
        <p className="text-muted-foreground">Carregando contatos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Leads e Contatos</h1>
          <p className="text-slate-500 mt-1">Gerencie as mensagens recebidas pelo site.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mensagens Recebidas</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum contato recebido ainda.</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[160px]">Data</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">E-mail</TableHead>
                      <TableHead className="hidden lg:table-cell">Empresa</TableHead>
                      <TableHead className="hidden lg:table-cell">WhatsApp</TableHead>
                      <TableHead className="w-[120px] text-right pr-6">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((c) => (
                      <TableRow key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                          {format(new Date(c.created), 'dd/MM/yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="font-medium text-slate-800">{c.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-slate-600">
                          {c.email}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-slate-600">
                          {c.company_name || '-'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-slate-600">
                          {c.whatsapp || '-'}
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-primary"
                              onClick={() => setSelectedContact(c)}
                              title="Ver detalhes"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver detalhes</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
                              onClick={() => setContactToDelete(c)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedContact} onOpenChange={(o) => !o && setSelectedContact(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
            <DialogDescription>
              Mensagem recebida em{' '}
              {selectedContact &&
                format(new Date(selectedContact.created), "dd 'de' MMMM 'de' yyyy 'às' HH:mm")}
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Nome</p>
                    <p className="text-base text-slate-800">{selectedContact.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-500">E-mail</p>
                    <p className="text-base text-slate-800 break-all">{selectedContact.email}</p>
                  </div>
                </div>
                {selectedContact.company_name && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Empresa</p>
                      <p className="text-base text-slate-800">{selectedContact.company_name}</p>
                    </div>
                  </div>
                )}
                {selectedContact.whatsapp && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-500">WhatsApp</p>
                      <p className="text-base text-slate-800">{selectedContact.whatsapp}</p>
                    </div>
                  </div>
                )}
              </div>
              {selectedContact.subject && (
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-500">Assunto</p>
                    <p className="text-base text-slate-800">{selectedContact.subject}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MessageSquare className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-500">Mensagem</p>
                  <div className="mt-2 p-4 bg-slate-50 rounded-md text-sm text-slate-700 whitespace-pre-wrap border border-slate-100">
                    {selectedContact.message}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!contactToDelete} onOpenChange={(o) => !o && setContactToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Contato</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir permanentemente o contato de{' '}
              <span className="font-semibold">{contactToDelete?.name}</span>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? 'Excluindo...' : 'Sim, excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
