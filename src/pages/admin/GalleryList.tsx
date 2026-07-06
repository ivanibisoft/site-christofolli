import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
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
import { getGalleryItems, deleteGalleryItem, type GalleryItem } from '@/services/gallery'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

export default function GalleryList() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadData = () => {
    getGalleryItems()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('gallery_items', () => {
    loadData()
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteGalleryItem(id)
      toast({ title: 'Imagem excluída com sucesso!' })
    } catch (error) {
      toast({ title: 'Erro ao excluir imagem', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Galeria</h1>
          <p className="text-slate-500 mt-1">Gerencie as imagens do portfólio e seus detalhes.</p>
        </div>
        <Button asChild className="shrink-0 shadow-sm">
          <Link to="/admin/gallery/new">
            <Plus className="h-4 w-4 mr-2" />
            Nova Imagem
          </Link>
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[100px]">Imagem</TableHead>
                <TableHead>Título e Categoria</TableHead>
                <TableHead className="w-[180px]">Data</TableHead>
                <TableHead className="w-[120px] text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center animate-pulse">
                      <ImageIcon className="h-8 w-8 text-slate-300 mb-2" />
                      Carregando dados...
                    </div>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-lg font-medium text-slate-700">Nenhuma imagem</p>
                      <p className="text-sm">Clique em "Nova Imagem" para adicionar a primeira.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-center py-3">
                      <div className="h-12 w-16 rounded-md bg-slate-100 overflow-hidden border border-slate-200">
                        {item.image ? (
                          <img
                            src={pb.files.getUrl(item, item.image, { thumb: '100x100' })}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-semibold text-slate-800 mb-1 leading-snug">
                        {item.title}
                      </div>
                      <div className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.expand?.category_id?.name || item.category}
                      </div>
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
                          <Link to={`/admin/gallery/${item.id}`}>
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
                              <AlertDialogTitle>Excluir Imagem?</AlertDialogTitle>
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
