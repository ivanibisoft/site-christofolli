import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Trash2, Eye } from 'lucide-react'
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
  const { toast } = useToast()

  const loadContacts = async () => {
    try {
      const data = await getContacts()
      setContacts(data)
    } catch (err) {
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
    try {
      await deleteContact(contactToDelete.id)
      toast({ title: 'Sucesso', description: 'Contato excluído com sucesso.' })
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o contato.',
        variant: 'destructive',
      })
    } finally {
      setContactToDelete(null)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Carregando contatos...</div>
  }

  return (
    <CustomContactsUI
      contacts={contacts}
      selectedContact={selectedContact}
      setSelectedContact={setSelectedContact}
      contactToDelete={contactToDelete}
      setContactToDelete={setContactToDelete}
      handleDelete={handleDelete}
    />
  )
}

function CustomContactsUI({
  contacts,
  selectedContact,
  setSelectedContact,
  contactToDelete,
  setContactToDelete,
  handleDelete,
}: {
  contacts: Contact[]
  selectedContact: Contact | null
  setSelectedContact: (c: Contact | null) => void
  contactToDelete: Contact | null
  setContactToDelete: (c: Contact | null) => void
  handleDelete: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Leads e Contatos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mensagens Recebidas</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum contato recebido ainda.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{format(new Date(c.created), 'dd/MM/yyyy HH:mm')}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.company_name || '-'}</TableCell>
                      <TableCell>{c.whatsapp || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedContact(c)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setContactToDelete(c)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedContact} onOpenChange={(o) => !o && setSelectedContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
            <DialogDescription>Informações enviadas pelo formulário.</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold">Nome</p>
                <p>{selectedContact.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Email</p>
                <p>{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Empresa</p>
                <p>{selectedContact.company_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">WhatsApp</p>
                <p>{selectedContact.whatsapp || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Assunto</p>
                <p>{selectedContact.subject || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Mensagem</p>
                <p className="whitespace-pre-wrap">{selectedContact.message}</p>
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
              Tem certeza? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function __ignore_original_render(contacts: Contact[]) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Leads e Contatos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mensagens Recebidas</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum contato recebido ainda.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(contact.created), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.subject || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedContact(contact)}
                          title="Ver mensagem"
                        >
                          <Eye className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setContactToDelete(contact)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
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
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Nome</h4>
                  <p className="text-base">{selectedContact.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">E-mail</h4>
                  <p className="text-base">{selectedContact.email}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-500">Assunto</h4>
                <p className="text-base">{selectedContact.subject || 'Não informado'}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-500">Mensagem</h4>
                <div className="mt-2 p-4 bg-slate-50 rounded-md text-sm whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!contactToDelete}
        onOpenChange={(open) => !open && setContactToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o contato de{' '}
              <span className="font-semibold">{contactToDelete?.name}</span> do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
