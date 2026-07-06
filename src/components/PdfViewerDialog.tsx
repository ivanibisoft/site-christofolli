import { useState, useEffect, useRef } from 'react'
import { Download, ExternalLink, AlertTriangle, FileText, RefreshCw } from 'lucide-react'
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
  const [retryKey, setRetryKey] = useState(0)
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open) {
      setHasError(false)
      setLoading(true)
      setRetryKey((k) => k + 1)

      if (loadTimerRef.current) clearTimeout(loadTimerRef.current)
      loadTimerRef.current = setTimeout(() => {
        setLoading((prev) => {
          if (prev) {
            setHasError(true)
            return false
          }
          return prev
        })
      }, 12000)

      return () => {
        if (loadTimerRef.current) clearTimeout(loadTimerRef.current)
      }
    }
  }, [open, url])

  const handleLoaded = () => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current)
    setLoading(false)
    setHasError(false)
  }

  const handleRetry = () => {
    setHasError(false)
    setLoading(true)
    setRetryKey((k) => k + 1)
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current)
    loadTimerRef.current = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          setHasError(true)
          return false
        }
        return prev
      })
    }, 12000)
  }

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
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Abrir em nova aba</span>
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={url} download={fileName}>
                  <Download className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Baixar</span>
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {!url ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-4 text-center max-w-sm">
              <div className="h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-800">Documento indisponível</h3>
              <p className="text-sm text-slate-500">
                O arquivo PDF não foi encontrado. Tente novamente mais tarde ou entre em contato.
              </p>
            </div>
          </div>
        ) : hasError ? (
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
            <div className="flex flex-col items-center gap-4 text-center max-w-sm">
              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="font-bold text-slate-800">
                Não foi possível carregar o PDF no visualizador
              </h3>
              <p className="text-sm text-slate-500">
                Seu navegador pode ter restringido a exibição do documento. Você pode abrir o
                documento em uma nova aba ou baixá-lo diretamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button asChild className="bg-accent hover:bg-accent/90 flex-1">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir documento em nova aba
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href={url} download={fileName}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </a>
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRetry} className="text-slate-500">
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative bg-slate-100 overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                <div className="flex flex-col items-center gap-3">
                  <FileText className="h-10 w-10 text-slate-400 animate-pulse" />
                  <p className="text-sm text-slate-500">Carregando documento...</p>
                </div>
              </div>
            )}

            <div className="absolute top-2 right-2 z-20 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                asChild
                className="shadow-md opacity-90 hover:opacity-100"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Nova aba
                </a>
              </Button>
            </div>

            <object
              key={retryKey}
              data={`${url}#toolbar=1&navpanes=0&view=FitH`}
              type="application/pdf"
              className="w-full h-full"
              onLoad={handleLoaded}
              aria-label={fileName}
            >
              <iframe
                key={`iframe-${retryKey}`}
                src={`${url}#toolbar=1&navpanes=0&view=FitH`}
                className="w-full h-full border-0"
                title={fileName}
                onLoad={handleLoaded}
                onError={() => {
                  setHasError(true)
                  setLoading(false)
                }}
              />
            </object>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
