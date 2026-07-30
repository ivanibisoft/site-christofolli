import { useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export type GalleryItem = RecordModel

interface GalleryImageDialogProps {
  items: GalleryItem[]
  openIndex: number | null
  onOpenChange: (open: boolean) => void
  onNavigate: (index: number) => void
  getCategoryName?: (item: GalleryItem) => string
  getPlaceholder: (item: GalleryItem, w: number, h: number) => string
  showCategory?: boolean
}

export function GalleryImageDialog({
  items,
  openIndex,
  onOpenChange,
  onNavigate,
  getCategoryName,
  getPlaceholder,
  showCategory = true,
}: GalleryImageDialogProps) {
  const isOpen = openIndex !== null && openIndex >= 0 && openIndex < items.length
  const current = isOpen && openIndex !== null ? items[openIndex] : null

  const handlePrev = useCallback(() => {
    if (openIndex !== null && openIndex > 0) onNavigate(openIndex - 1)
  }, [openIndex, onNavigate])

  const handleNext = useCallback(() => {
    if (openIndex !== null && openIndex < items.length - 1) onNavigate(openIndex + 1)
  }, [openIndex, items.length, onNavigate])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handlePrev, handleNext])

  const canPrev = openIndex !== null && openIndex > 0
  const canNext = openIndex !== null && openIndex < items.length - 1

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {current && (
        <DialogContent
          className="max-w-4xl bg-transparent border-none shadow-none p-0 flex flex-col justify-center items-center"
          aria-label="Visualização de imagem da galeria"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{current.title}</DialogTitle>
            <DialogDescription>{current.description}</DialogDescription>
          </DialogHeader>
          <div className="relative bg-background rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl">
            {canPrev && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg h-10 w-10"
                onClick={handlePrev}
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            {canNext && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg h-10 w-10"
                onClick={handleNext}
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
            <img
              src={
                current.image
                  ? pb.files.getUrl(current, current.image)
                  : getPlaceholder(current, 1200, 800)
              }
              alt={current.title}
              className="w-full max-h-[80vh] object-contain bg-muted/30"
            />
            <div className="p-6">
              {showCategory && getCategoryName && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
                    {getCategoryName(current)}
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-foreground mb-2">{current.title}</h3>
              {current.description && (
                <p className="text-muted-foreground">{current.description}</p>
              )}
              {items.length > 1 && (
                <p className="text-sm text-muted-foreground mt-3">
                  {openIndex! + 1} de {items.length}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
