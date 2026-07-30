import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import {
  getGalleryItemsExcludingStatistical,
  getStatisticalResults,
  type GalleryItem,
} from '@/services/gallery'
import { getGalleryCategories, type GalleryCategory } from '@/services/gallery-categories'
import { GalleryImageDialog } from '@/components/GalleryImageDialog'

const ALL_CATEGORIES = 'Todas'

export default function Portfolio() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [statResults, setStatResults] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statLoading, setStatLoading] = useState(true)
  const [category, setCategory] = useState<string>(ALL_CATEGORIES)
  const [galleryOpenIndex, setGalleryOpenIndex] = useState<number | null>(null)
  const [statOpenIndex, setStatOpenIndex] = useState<number | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [galleryData, catData] = await Promise.all([
        getGalleryItemsExcludingStatistical(),
        getGalleryCategories(),
      ])
      setItems(galleryData)
      setCategories(catData.filter((c) => c.name !== 'Gráficos Estatísticos'))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStatResults = useCallback(async () => {
    try {
      setStatResults(await getStatisticalResults())
    } catch (error) {
      console.error(error)
    } finally {
      setStatLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    loadStatResults()
  }, [loadData, loadStatResults])

  useRealtime('gallery_items', () => {
    loadData()
    loadStatResults()
  })
  useRealtime('gallery_categories', () => {
    loadData()
  })

  const filteredItems =
    category === ALL_CATEGORIES ? items : items.filter((item) => item.category_id === category)

  useEffect(() => {
    setGalleryOpenIndex(null)
  }, [category])

  useEffect(() => {
    if (galleryOpenIndex !== null && galleryOpenIndex >= filteredItems.length) {
      setGalleryOpenIndex(null)
    }
  }, [filteredItems.length, galleryOpenIndex])

  useEffect(() => {
    if (statOpenIndex !== null && statOpenIndex >= statResults.length) {
      setStatOpenIndex(null)
    }
  }, [statResults.length, statOpenIndex])

  const getCategoryName = (item: GalleryItem) =>
    item.expand?.category_id?.name || item.category || 'Geral'

  const getGalleryPlaceholder = (item: GalleryItem, w: number, h: number) =>
    `https://img.usecurling.com/p/${w}/${h}?q=${encodeURIComponent(
      getCategoryName(item) === 'Ensaios' ? 'concrete laboratory' : 'construction',
    )}&color=gray`

  const getStatPlaceholder = (_item: GalleryItem, w: number, h: number) =>
    `https://img.usecurling.com/p/${w}/${h}?q=concrete%20statistics&color=gray`

  const handleCardKeyDown = (
    e: { key: string; preventDefault: () => void },
    action: () => void,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <div className="py-12 animate-fade-in">
      <div className="container">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Portfólio & Inteligência de Dados</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Resultados comprovados através da experiência consolidada ao longo de mais de 30 anos na
            aplicação de métodos estatísticos e controles rigorosos em Centrais de concreto de
            grande e pequeno porte de produção, assim como em obras emblemáticas com aplicação e
            estudo de soluções para uso de concretos especiais.
          </p>
        </div>

        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-primary">Galeria de Imagens</h2>
            <Tabs defaultValue={ALL_CATEGORIES} value={category} onValueChange={setCategory}>
              <TabsList className="flex flex-wrap h-auto">
                <TabsTrigger value={ALL_CATEGORIES}>{ALL_CATEGORIES}</TabsTrigger>
                {categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id}>
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl w-full" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
              <p className="text-muted-foreground">Nenhuma imagem encontrada nesta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setGalleryOpenIndex(index)}
                  onKeyDown={(e) => handleCardKeyDown(e, () => setGalleryOpenIndex(index))}
                  className="group relative overflow-hidden rounded-xl h-64 bg-muted/50 cursor-pointer flex items-center justify-center border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={
                      item.image
                        ? pb.files.getUrl(item, item.image)
                        : getGalleryPlaceholder(item, 600, 450)
                    }
                    alt={item.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs font-medium text-white/80 uppercase tracking-wider mb-1">
                      {getCategoryName(item)}
                    </span>
                    <h3 className="text-white font-semibold text-lg leading-tight">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-primary mb-6">Gráficos Estatísticos</h2>
        {statLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl w-full" />
            ))}
          </div>
        ) : statResults.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed mb-16">
            <p className="text-muted-foreground">
              Nenhum resultado estatístico disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {statResults.map((item, index) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => setStatOpenIndex(index)}
                onKeyDown={(e) => handleCardKeyDown(e, () => setStatOpenIndex(index))}
                className="group relative overflow-hidden rounded-xl bg-card border cursor-pointer shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="h-64 overflow-hidden bg-muted/50 flex items-center justify-center">
                  <img
                    src={
                      item.image
                        ? pb.files.getUrl(item, item.image)
                        : getStatPlaceholder(item, 600, 450)
                    }
                    alt={item.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16 bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Pronto para otimizar seus resultados?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubra como nossa expertise técnica e inteligência de dados podem trazer economia e
            eficiência para o seu projeto estrutural ou central dosadora.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 h-14 px-8 text-lg shadow-xl"
          >
            <Link to="/#contato">Entre em Contato</Link>
          </Button>
        </div>
      </div>

      <GalleryImageDialog
        items={filteredItems}
        openIndex={galleryOpenIndex}
        onOpenChange={(open) => !open && setGalleryOpenIndex(null)}
        onNavigate={setGalleryOpenIndex}
        getCategoryName={getCategoryName}
        getPlaceholder={getGalleryPlaceholder}
        showCategory
      />

      <GalleryImageDialog
        items={statResults}
        openIndex={statOpenIndex}
        onOpenChange={(open) => !open && setStatOpenIndex(null)}
        onNavigate={setStatOpenIndex}
        getPlaceholder={getStatPlaceholder}
        showCategory={false}
      />
    </div>
  )
}
