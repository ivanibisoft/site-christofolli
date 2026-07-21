import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Plus, Trash2, GraduationCap, Briefcase, GripVertical, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  getTimelineItems,
  deleteTimelineItem,
  updateTimelineItem,
  type TimelineItem,
} from '@/services/timeline-items'
import { useRealtime } from '@/hooks/use-realtime'
import { cn } from '@/lib/utils'

export default function TimelineList() {
  const [items, setItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [reordering, setReordering] = useState(false)
  const { toast } = useToast()

  const loadData = useCallback(() => {
    getTimelineItems()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('timeline_items', () => {
    loadData()
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteTimelineItem(id)
      toast({ title: 'Item excluído com sucesso!' })
    } catch {
      toast({ title: 'Erro ao excluir item', variant: 'destructive' })
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedId && id !== draggedId) {
      setDragOverId(id)
    }
  }

  const handleDragLeave = () => {
    setDragOverId(null)
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    setDragOverId(null)
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      return
    }

    const draggedIndex = items.findIndex((i) => i.id === draggedId)
    const targetIndex = items.findIndex((i) => i.id === targetId)
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null)
      return
    }

    const reordered = [...items]
    const [moved] = reordered.splice(draggedIndex, 1)
    reordered.splice(targetIndex, 0, moved)

    const updates = reordered
      .map((item, idx) => ({ id: item.id, order: idx + 1 }))
      .filter((u) => {
        const original = items.find((i) => i.id === u.id)
        return original?.order !== u.order
      })

    setItems(reordered)
    setDraggedId(null)
    setReordering(true)

    try {
      await Promise.all(updates.map((u) => updateTimelineItem(u.id, { order: u.order })))
      toast({ title: 'Ordem atualizada com sucesso!' })
    } catch {
      toast({ title: 'Erro ao atualizar ordem', variant: 'destructive' })
      loadData()
    } finally {
      setReordering(false)
    }
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Trajetória Profissional e Acadêmica
          </h1>
          <p className="text-slate-500 mt-1">
            Gerencie os itens da linha do tempo exibidos na página Sobre. Arraste para reordenar.
          </p>
        </div>
        <Button asChild className="shrink-0 shadow-sm">
          <Link to="/admin/timeline/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Link>
        </Button>
      </div>

      {reordering && (
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 px-4 py-2 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          Salvando nova ordem...
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin mb-2 text-slate-300" />
            Carregando dados...
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-16 flex flex-col items-center justify-center text-slate-500">
              <GraduationCap className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-lg font-medium text-slate-700">Nenhum item</p>
              <p className="text-sm">Clique em "Novo Item" para adicionar o primeiro.</p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                'group transition-all cursor-grab active:cursor-grabbing',
                draggedId === item.id && 'opacity-50 scale-[0.98]',
                dragOverId === item.id && 'border-primary ring-2 ring-primary/20',
              )}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-400 shrink-0">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-primary/10 text-primary">
                  {item.type === 'academic' ? (
                    <GraduationCap className="h-5 w-5" />
                  ) : (
                    <Briefcase className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-accent text-sm">{item.period}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.type === 'academic' ? 'Acadêmico' : 'Profissional'}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-800 leading-snug">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.institution}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 text-slate-500 hover:text-primary"
                  >
                    <Link to={`/admin/timeline/${item.id}`}>
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
                        <AlertDialogTitle>Excluir Item?</AlertDialogTitle>
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
