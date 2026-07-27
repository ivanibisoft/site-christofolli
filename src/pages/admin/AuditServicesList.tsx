import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Plus, Trash2, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { useToast } from '@/hooks/use-toast'
import { getAuditServices, deleteAuditService, type AuditService } from '@/services/audit-services'
import { useRealtime } from '@/hooks/use-realtime'

export default function AuditServicesList() {
  const [items, setItems] = useState<AuditService[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadData = () => {
    getAuditServices()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('audit_services', () => {
    loadData()
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteAuditService(id)
      toast({ title: 'Serviço excluído com sucesso!' })
    } catch {
      toast({ title: 'Erro ao excluir serviço', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Serviços de Consultoria
          </h1>
          <p className="text-slate-500 mt-1">
            Gerencie os serviços de consultoria exibidos na página de Concreteiras.
          </p>
        </div>
        <Button asChild className="shrink-0 shadow-sm">
          <Link to="/admin/audit-services/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Link>
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[60px]">Ordem</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="w-[180px]">Data</TableHead>
                <TableHead className="w-[120px] text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center animate-pulse">
                      <ClipboardList className="h-8 w-8 text-slate-300 mb-2" />
                      Carregando dados...
                    </div>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-lg font-medium text-slate-700">Nenhum serviço</p>
                      <p className="text-sm">Clique em "Novo Serviço" para adicionar o primeiro.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-4 text-slate-600 font-medium text-sm">
                      {item.order ?? '-'}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-semibold text-slate-800 leading-snug">{item.title}</div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium text-sm">
                      {new Date(item.created).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-slate-500 hover:text-primary"
                        >
                          <Link to={`/admin/audit-services/${item.id}`}>
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Serviço?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover <strong>"{item.title}"</strong>{' '}
                                permanentemente?
                                <br />
                                Esta ação não poderá ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleDelete(item.id)}
                              >
                                Sim, excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
