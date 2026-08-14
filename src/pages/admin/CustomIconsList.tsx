import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Palette, Loader2 } from 'lucide-react'
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
  getCustomIcons,
  createCustomIcon,
  updateCustomIcon,
  deleteCustomIcon,
  type CustomIcon,
} from '@/services/custom-icons'
import { useRealtime } from '@/hooks/use-realtime'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { getLucideIcon } from '@/lib/lucide-icons'

export default function CustomIconsList() {
  const [icons, setIcons] = useState<CustomIcon[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIcon, setEditingIcon] = useState<CustomIcon | null>(null)
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<CustomIcon | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const loadData = () => {
    getCustomIcons()
      .then(setIcons)
      .catch(() => {
        toast({ title: 'Erro ao carregar ícones', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('custom_icons', () => {
    loadData()
  })

  const openCreate = () => {
    setEditingIcon(null)
    setName('')
    setLabel('')
    setFieldErrors({})
    setDialogOpen(true)
  }

  const openEdit = (icon: CustomIcon) => {
    setEditingIcon(icon)
    setName(icon.name)
    setLabel(icon.label)
    setFieldErrors({})
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim() || !label.trim()) {
      setFieldErrors({
        ...(!name.trim() && { name: 'O nome é obrigatório' }),
        ...(!label.trim() && { label: 'O label é obrigatório' }),
      })
      return
    }
    setSaving(true)
    setFieldErrors({})
    try {
      const data = { name: name.trim(), label: label.trim() }
      if (editingIcon) {
        await updateCustomIcon(editingIcon.id, data)
        toast({ title: 'Ícone atualizado com sucesso!' })
      } else {
        await createCustomIcon(data)
        toast({ title: 'Ícone adicionado com sucesso!' })
      }
      setDialogOpen(false)
    } catch (error) {
      const errors = extractFieldErrors(error)
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
      } else {
        toast({ title: 'Erro ao salvar ícone', variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteCustomIcon(deleteTarget.id)
      toast({ title: 'Ícone excluído com sucesso!' })
    } catch {
      toast({ title: 'Erro ao excluir ícone', variant: 'destructive' })
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Ícones</h1>
          <p className="text-slate-500 mt-1">
            Cadastre ícones personalizados para usar nos serviços de construtoras.
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Ícone
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[80px]">Ícone</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Label</TableHead>
                <TableHead className="w-[120px] text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center animate-pulse">
                      <Palette className="h-8 w-8 text-slate-300 mb-2" />
                      Carregando dados...
                    </div>
                  </TableCell>
                </TableRow>
              ) : icons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Palette className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-lg font-medium text-slate-700">Nenhum ícone</p>
                      <p className="text-sm">
                        Clique em "Adicionar Ícone" para cadastrar o primeiro.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                icons.map((icon) => {
                  const Icon = getLucideIcon(icon.name)
                  return (
                    <TableRow
                      key={icon.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="py-4 text-center">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto">
                          <Icon className="h-5 w-5" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-mono text-sm font-semibold text-slate-800">
                        {icon.name}
                      </TableCell>
                      <TableCell className="py-4 text-slate-700">{icon.label}</TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(icon)}
                            className="h-8 w-8 text-slate-500 hover:text-primary"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(icon)}
                            className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIcon ? 'Editar Ícone' : 'Novo Ícone'}</DialogTitle>
            <DialogDescription>
              {editingIcon
                ? 'Atualize os dados do ícone.'
                : 'Cadastre um novo ícone para usar nos serviços de construtoras.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">
                Nome (Lucide) <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setFieldErrors((f) => ({ ...f, name: '' }))
                }}
                placeholder="Ex: Zap, Shield, Lightbulb..."
                className="bg-slate-50 focus:bg-white font-mono"
                autoFocus
              />
              {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">
                Label (português) <span className="text-red-500">*</span>
              </label>
              <Input
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value)
                  setFieldErrors((f) => ({ ...f, label: '' }))
                }}
                placeholder="Ex: Relâmpago, Escudo, Lâmpada..."
                className="bg-slate-50 focus:bg-white"
              />
              {fieldErrors.label && <p className="text-sm text-red-500">{fieldErrors.label}</p>}
            </div>
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
            <AlertDialogTitle>Excluir Ícone?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>"{deleteTarget?.label}"</strong>{' '}
              permanentemente?
              <br />
              Esta ação não poderá ser desfeita.
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
