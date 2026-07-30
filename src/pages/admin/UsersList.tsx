import { useEffect, useState } from 'react'
import { Users as UsersIcon, Plus, Trash2, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { getUsers, deleteUser, type User } from '@/services/users'
import { CreateUserDialog } from '@/components/admin/CreateUserDialog'

export default function UsersList() {
  const { user, isAdmin, loading } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadData = () => {
    getUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setDataLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('users', () => {
    loadData()
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id)
      toast({ title: 'Usuário removido com sucesso!' })
    } catch {
      toast({ title: 'Erro ao remover usuário', variant: 'destructive' })
    }
  }

  if (loading) return null

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Acesso Negado</h2>
        <p className="text-slate-500 mt-1">Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Usuários</h1>
          <p className="text-slate-500 mt-1">Gerencie os administradores do sistema.</p>
        </div>
        <Button className="shrink-0 shadow-sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Administrador
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="w-[120px]">Função</TableHead>
                <TableHead className="w-[140px]">Data</TableHead>
                <TableHead className="w-[80px] text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center animate-pulse">
                      <UsersIcon className="h-8 w-8 text-slate-300 mb-2" />
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-4 font-semibold text-slate-800">
                      {u.name || '-'}
                    </TableCell>
                    <TableCell className="py-4 text-slate-600">{u.email}</TableCell>
                    <TableCell className="py-4">
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                        {u.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-slate-600 text-sm">
                      {new Date(u.created).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      {u.id !== user?.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remover</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover Usuário?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover{' '}
                                <strong>"{u.name || u.email}"</strong> permanentemente?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleDelete(u.id)}
                              >
                                Sim, remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={loadData}
        existingEmails={users.map((u) => u.email.toLowerCase())}
      />
    </div>
  )
}
