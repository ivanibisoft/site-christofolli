import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowUpRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getBlogPublications, type Publication } from '@/services/publications'
import { getFileUrl } from '@/lib/file-url'
import { useRealtime } from '@/hooks/use-realtime'

export default function Blog() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

  const loadPublications = async () => {
    try {
      const pubs = await getBlogPublications()
      setPublications(pubs)
    } catch {
      setPublications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPublications()
  }, [])

  useRealtime('publications', () => {
    loadPublications()
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="flex flex-col animate-fade-in">
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Artigos e conteúdos sobre engenharia de concreto e tecnologia dos materiais.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : publications.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Nenhum post disponível</h3>
              <p className="text-muted-foreground">
                Ainda não há publicações no blog. Volte em breve para novos conteúdos!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub) => (
                <Card
                  key={pub.id}
                  className="overflow-hidden border-none shadow-elevation hover:-translate-y-1 transition-transform duration-300 flex flex-col"
                >
                  {pub.cover_image ? (
                    <div className="h-48 overflow-hidden bg-muted/30 flex items-center justify-center">
                      <img
                        src={getFileUrl(pub, pub.cover_image)}
                        alt={pub.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                  <CardContent className="p-6 flex flex-col flex-1">
                    {pub.published_date && (
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <p className="text-xs font-medium">{formatDate(pub.published_date)}</p>
                      </div>
                    )}
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-primary">
                      {pub.title}
                    </h3>
                    {pub.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {pub.description}
                      </p>
                    )}
                    <div className="mt-auto">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/publicacoes/${pub.id}`}>
                          Ler mais <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
