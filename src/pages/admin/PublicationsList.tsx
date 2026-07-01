import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Plus, Trash2, FileText, ExternalLink } from 'lucide-react'
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
import { getPublications, deletePublication, type Publication } from '@/services/publications'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

export default function PublicationsList() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadData = () => {
    getPublications()
      .then(setPublications)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('publications', () => {
    loadData()
  })

  const handleDelete = async (id: string) => {
    try {
      await deletePublication(id)
      toast({ title: 'Publicação excluída com sucesso!' })
    } catch (error) {
      toast({ title: 'Erro ao excluir publicação', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Publicações</h1>
          <p className="text-slate-500 mt-1">
            Gerencie seu acervo de artigos e trabalhos técnicos.
          </p>
        </div>
        <Button asChild className="shrink-0 shadow-sm">
          <Link to="/admin/publications/new">
            <Plus className="h-4 w-4 mr-2" />
            Nova Publicação
          </Link>
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="w-[180px]">Data de Publicação</TableHead>
                <TableHead className="w-[160px] text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center animate-pulse">
                      <FileText className="h-8 w-8 text-slate-300 mb-2" />
                      Carregando dados...
                    </div>
                  </TableCell>
                </TableRow>
              ) : publications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-lg font-medium text-slate-700">Nenhuma publicação</p>
                      <p className="text-sm">
                        Clique em "Nova Publicação" para adicionar a primeira.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                publications.map((pub) => (
                  <TableRow key={pub.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-center">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <FileText className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-semibold text-slate-800 mb-1 leading-snug">
                        {pub.title}
                      </div>
                      {pub.pdf_file && (
                        <span className="inline-flex items-center text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          PDF
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {pub.published_date
                        ? new Date(pub.published_date).toLocaleDateString('pt-BR', {
                            timeZone: 'UTC',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                        {pub.pdf_file && (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 text-slate-500 hover:text-primary"
                          >
                            <a
                              href={pb.files.getUrl(pub as any, pub.pdf_file)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Abrir PDF</span>
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-slate-500 hover:text-primary"
                        >
                          <Link to={`/admin/publications/${pub.id}`}>
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
                              <AlertDialogTitle>Excluir Publicação?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover <strong>"{pub.title}"</strong>{' '}
                                permanentemente?
                                <br />
                                Esta ação não poderá ser desfeita e a publicação sairá imediatamente
                                do site.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleDelete(pub.id)}
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
