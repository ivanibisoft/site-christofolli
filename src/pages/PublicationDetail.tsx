import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Linkedin, Mail, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getPublication, type Publication } from '@/services/publications'
import { getFileUrl } from '@/lib/file-url'
import { PdfViewerDialog } from '@/components/PdfViewerDialog'
import { useRealtime } from '@/hooks/use-realtime'

export default function PublicationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [publication, setPublication] = useState<Publication | null>(null)
  const [loading, setLoading] = useState(true)
  const [pdfViewer, setPdfViewer] = useState<{ url: string; fileName: string } | null>(null)

  const loadPublication = async () => {
    if (!id) return
    try {
      const pub = await getPublication(id)
      setPublication(pub)
    } catch {
      setPublication(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPublication()
  }, [id])

  useRealtime('publications', () => {
    loadPublication()
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="py-12 animate-fade-in">
        <div className="container max-w-4xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
        </div>
      </div>
    )
  }

  if (!publication) {
    return (
      <div className="py-20 animate-fade-in">
        <div className="container max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Publicação não encontrada</h1>
          <p className="text-muted-foreground mb-8">
            A publicação que você procura não está disponível ou foi removida.
          </p>
          <Button asChild>
            <Link to="/">Voltar ao Início</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 animate-fade-in">
      <div className="container max-w-4xl">
        <Button
          variant="ghost"
          className="mb-8 text-slate-600 hover:text-primary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        <article>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">
            {publication.title}
          </h1>

          {publication.published_date && (
            <div className="flex items-center gap-2 text-muted-foreground mb-8">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">{formatDate(publication.published_date)}</span>
            </div>
          )}

          {publication.cover_image && (
            <div className="rounded-xl overflow-hidden bg-muted/30 mb-8 border">
              <img
                src={getFileUrl(publication, publication.cover_image)}
                alt={publication.title}
                className="w-full h-auto object-contain max-h-[600px]"
              />
            </div>
          )}

          {publication.description && (
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                {publication.description}
              </p>
            </div>
          )}

          {publication.pdf_file && (
            <div className="mt-8">
              <Button
                variant="outline"
                onClick={() =>
                  setPdfViewer({
                    url: getFileUrl(publication, publication.pdf_file),
                    fileName: publication.pdf_file,
                  })
                }
              >
                <FileText className="mr-2 h-4 w-4" /> Visualizar PDF
              </Button>
            </div>
          )}
        </article>

        <Card className="mt-16 bg-slate-900 text-white border-none shadow-xl">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Gostou deste conteúdo?</h3>
              <p className="text-slate-300 text-sm">
                Entre em contato para saber mais sobre nossos serviços de consultoria.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link to="/#contato">Fale Conosco</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                <a
                  href="https://www.linkedin.com/in/jorge-christofolli-4b4aaa73/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                <a href="mailto:jorge@christofolli.com.br">
                  <Mail className="mr-2 h-4 w-4" /> E-mail
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {pdfViewer && (
        <PdfViewerDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setPdfViewer(null)
          }}
          url={pdfViewer.url}
          fileName={pdfViewer.fileName}
        />
      )}
    </div>
  )
}
