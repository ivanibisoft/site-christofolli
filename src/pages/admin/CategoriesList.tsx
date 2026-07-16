import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Tag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { useToast } from '@/hooks/use-toast'
import {
  getGalleryCategories,
  createGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory,
  type GalleryCategory,
} from '@/services/gallery-categories'
import { useRealtime } from '@/hooks/use-realtime'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import pb from '@/lib/pocketbase/client'

export default function CategoriesList() {
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<GalleryCategory | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [linkedItemsCount, setLinkedItemsCount] = useState(0)
  const { toast } = useToast()

  const loadData = () => {
    getGalleryCategories()
      .then(setCategories)
      .catch(() => {
        toast({ title: 'Erro ao carregar categorias', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('gallery_categories', () => {
    loadData()
  })

  const openCreate = () => {
    setEditingCategory(null)
    setName('')
    setFieldError(null)
    setDialogOpen(true)
  }

  const openEdit = (cat: GalleryCategory) => {
    setEditingCategory(cat)
    setName(cat.name)
    setFieldError(null)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setFieldError('O nome é obrigatório')
      return
    }
    setSaving(true)
    setFieldError(null)
    try {
      if (editingCategory) {
        await updateGalleryCategory(editingCategory.id, { name: name.trim() })
        toast({ title: 'Categoria atualizada com sucesso!' })
      } else {
        await createGalleryCategory({ name: name.trim() })
        toast({ title: 'Categoria criada com sucesso!' })
      }
      setDialogOpen(false)
    } catch (error) {
      const errors = extractFieldErrors(error)
      if (errors.name) {
        setFieldError(errors.name)
      } else {
        toast({ title: 'Erro ao salvar categoria', variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = async (cat: GalleryCategory) => {
    setDeleteTarget(cat)
    setLinkedItemsCount(0)
    try {
      const items = await pb.collection('gallery_items').getFullList({
        filter: `category_id = "${cat.id}"`,
      })
      setLinkedItemsCount(items.length)
    } catch {
      setLinkedItemsCount(0)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteGalleryCategory(deleteTarget.id)
      toast({ title: 'Categoria excluída com sucesso!' })
    } catch {
      toast({ title: 'Erro ao excluir categoria', variant: 'destructive' })
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Categorias</h1>
          <p className="text-slate-500 mt-1">Gerencie as categorias da galeria de imagens.</p>
        </div>
        <Button onClick={openCreate} className="shrink-0 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[180px]">Data de Criação</TableHead>
                <TableHead className="w-[120px] text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center animate-pulse">
                      <Tag className="h-8 w-8 text-slate-300 mb-2" />
                      Carregando dados...
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Tag className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-lg font-medium text-slate-700">Nenhuma categoria</p>
                      <p className="text-sm">
                        Clique em "Nova Categoria" para adicionar a primeira.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-center">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <Tag className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-slate-800">{cat.name}</TableCell>
                    <TableCell className="text-slate-600 font-medium text-sm">
                      {new Date(cat.created).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(cat)}
                          className="h-8 w-8 text-slate-500 hover:text-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(cat)}
                          className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Atualize o nome da categoria.'
                : 'Crie uma nova categoria para organizar as imagens da galeria.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label className="text-sm font-medium text-slate-800">
              Nome <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setFieldError(null)
              }}
              placeholder="Ex: Obras, Eventos, Equipe..."
              className="bg-slate-50 focus:bg-white"
              autoFocus
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
              className="text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>"{deleteTarget?.name}"</strong>{' '}
              permanentemente?
              <br />
              Esta ação não poderá ser desfeita.
              {linkedItemsCount > 0 && (
                <span className="block mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                  ⚠️ Esta categoria está vinculada a {linkedItemsCount}{' '}
                  {linkedItemsCount === 1 ? 'item' : 'itens'} da galeria. Ao excluir, os itens
                  perderão a associação com esta categoria.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
