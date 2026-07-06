import { useState, useEffect } from 'react'
import { Download, ExternalLink, AlertTriangle, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface PdfViewerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  fileName: string
}

export function PdfViewerDialog({ open, onOpenChange, url, fileName }: PdfViewerDialogProps) {
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setHasError(false)
      setLoading(true)
    }
  }, [open, url])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[92vh] sm:max-w-5xl p-0 flex flex-col gap-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-primary truncate">
              <FileText className="h-5 w-5 text-accent shrink-0" />
              <span className="truncate">{fileName}</span>
            </DialogTitle>
            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" variant="outline" asChild>
                <a href={url} download={fileName}>
                  <Download className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Baixar</span>
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Abrir</span>
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 relative bg-slate-100 overflow-hidden">
          {loading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
              <div className="flex flex-col items-center gap-3">
                <FileText className="h-10 w-10 text-slate-400 animate-pulse" />
                <p className="text-sm text-slate-500">Carregando documento...</p>
              </div>
            </div>
          )}

          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="font-bold text-slate-800">Não foi possível carregar o PDF</h3>
                <p className="text-sm text-slate-500">
                  O visualizador não conseguiu exibir este documento. Você pode baixá-lo
                  diretamente.
                </p>
                <Button asChild className="bg-accent hover:bg-accent/90">
                  <a href={url} download={fileName}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar arquivo
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              src={`${url}#toolbar=1`}
              className="w-full h-full border-0"
              title={fileName}
              onLoad={() => setLoading(false)}
              onError={() => {
                setHasError(true)
                setLoading(false)
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
