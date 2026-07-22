import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Factory,
  HardHat,
  TrendingDown,
  ShieldCheck,
  Leaf,
  Linkedin,
  Mail,
  FileText,
  ArrowUpRight,
} from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createContact } from '@/services/contacts'
import {
  getCompanyProfile,
  getDirectorPhotoUrl,
  type CompanyProfile,
} from '@/services/company-profile'
import { useRealtime } from '@/hooks/use-realtime'
import { getGalleryCategories, type GalleryCategory } from '@/services/gallery-categories'
import { getRecentPublications, type Publication } from '@/services/publications'
import { getFileUrl } from '@/lib/file-url'
import { Skeleton } from '@/components/ui/skeleton'
import heroBg from '@/assets/logo-3d-sem-texto-27f6f.png'

const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  company_name: z.string().optional(),
  whatsapp: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres'),
})

export default function Index() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [directorPhoto, setDirectorPhoto] = useState<string | null>(null)
  const [galleryCats, setGalleryCats] = useState<GalleryCategory[]>([])
  const [publications, setPublications] = useState<Publication[]>([])
  const [publicationsLoading, setPublicationsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])

  const loadDirectorPhoto = async () => {
    try {
      const profile = await getCompanyProfile()
      setDirectorPhoto(getDirectorPhotoUrl(profile))
    } catch {
      setDirectorPhoto(null)
    }
  }

  useEffect(() => {
    loadDirectorPhoto()
  }, [])

  useRealtime('company_profile', () => {
    loadDirectorPhoto()
  })

  const loadGalleryCats = async () => {
    try {
      const cats = await getGalleryCategories()
      setGalleryCats(cats)
    } catch {
      setGalleryCats([])
    }
  }

  useEffect(() => {
    loadGalleryCats()
  }, [])

  useRealtime('gallery_categories', () => {
    loadGalleryCats()
  })

  const loadPublications = async () => {
    try {
      const pubs = await getRecentPublications(3)
      setPublications(pubs)
    } catch {
      setPublications([])
    } finally {
      setPublicationsLoading(false)
    }
  }

  useEffect(() => {
    loadPublications()
  }, [])

  useRealtime('publications', () => {
    loadPublications()
  })

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company_name: '',
      whatsapp: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof contactSchema>) => {
    setIsSubmitting(true)
    try {
      await createContact(data)
      toast({ title: 'Mensagem enviada!', description: 'Entraremos em contato em breve.' })
      form.reset()
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const keywords = [
    'Concreto de Alta Resistência',
    'Controle Térmico',
    'Argila Calcinada',
    'Redução de GEE',
    'Estatística Aplicada',
    'Concreto Auto Adensável CAA',
    'Módulo de Elasticidade',
    'Centrais de Concreto',
    'Concretos Especiais',
    'Obras Especiais',
  ]

  return (
    <div className="flex flex-col animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Christófolli Consultoria Logo"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50 mix-blend-multiply" />
        </div>

        <div className="container relative z-10 text-center text-white px-4 mt-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white animate-slide-up">
            Engenharia de Concreto de <span className="text-accent">Alta Performance</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 animate-fade-in-up">
            <span id="docs-internal-guid-47857bd7-7fff-7f45-797c-4964dbeda775">
              <span>
                Consultoria técnica e operacional para CONCRETEIRAS e concretos especiais para
                CONSTRUTORAS. Otimização de custos, excelência em qualidade e sustentabilidade.
              </span>
            </span>
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-lg w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              <Link to="/construtoras">
                <HardHat className="mr-2 h-5 w-5" /> Para Construtoras
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg w-full sm:w-auto bg-white/10 text-white hover:bg-white hover:text-primary border-white/20"
            >
              <Link to="/concreteiras">
                <Factory className="mr-2 h-5 w-5" /> Para Concreteiras
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">Pilares de Atuação</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Soluções baseadas em dados, experiência prática e rigor científico para garantir os
              melhores resultados na sua obra ou central.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingDown,
                title: 'Redução de Custos',
                desc: 'Otimização de traços e materiais, reduzindo desperdícios e custo por m³.',
              },
              {
                icon: ShieldCheck,
                title: 'Controle Estatístico',
                desc: 'Análise consolidada do desvio padrão dos concretos, cálculo do fckest e garantia de conformidade da resistência com confiabilidade e economia.',
              },
              {
                icon: Leaf,
                title: 'Sustentabilidade',
                desc: 'Minimização da emissão de GEE com adições minerais e aditivos de alta performance.',
              },
              {
                icon: CheckCircle2,
                title: 'Mitigação de Riscos',
                desc: 'Prevenção de patologias como: (DEF/RAA), carbonatação, ataque por cloretos, sulfatos, cálculo prévio do comportamento térmico em blocos massivos e avaliação da necessidade do uso de gelo e/ou nitrogênio (kg/m3).',
              },
            ].map((prop, i) => (
              <Card
                key={i}
                className="border-none shadow-elevation hover:-translate-y-1 transition-transform duration-300"
              >
                <CardContent className="pt-8 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                    <prop.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{prop.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{prop.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Snapshot */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3 relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative z-10 border-4 border-white">
                <img
                  src={directorPhoto || 'https://img.usecurling.com/ppl/large?gender=male&seed=99'}
                  alt="Jorge Luiz Christofolli"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full rounded-2xl bg-accent opacity-20 z-0"></div>
            </div>

            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold mb-6 text-primary">Jorge Luiz Christofolli</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Doutor em Engenharia Civil pela Universidade Federal do Paraná (UFPR), com mais de
                30 anos de experiência dedicados à cadeia produtiva do concreto. Especialista em
                patologia das construções e métodos probabilísticos para dosagem.
              </p>

              <h3 className="text-sm font-bold text-slate-700 mb-3 tracking-wide">
                TÓPICOS DE ATUAÇÃO
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-full shadow-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/sobre">
                    Ver Currículo Completo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="text-[#0A66C2] border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
                >
                  <a
                    href="https://www.linkedin.com/in/jorge-christofolli-4b4aaa73/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="mr-2 h-4 w-4" /> Conectar no LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Blog</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Artigos e conteúdos recentes sobre engenharia de concreto e tecnologia dos materiais.
            </p>
          </div>
          {publicationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : publications.length === 0 ? null : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <p className="text-xs text-muted-foreground mb-2 font-medium">
                        {new Date(pub.published_date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
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

      {/* Gallery Categories */}
      {galleryCats.length > 0 && null}

      {/* Contact Section */}
      <section className="py-20 bg-white" id="contato">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Entre em Contato</h2>
            <p className="text-muted-foreground mb-6">
              Preencha o formulário abaixo para enviar sua mensagem ou solicitar uma consultoria.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href="mailto:jorge@christofolli.com.br"
                className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>jorge@christofolli.com.br</span>
              </a>
              <a
                href="https://www.linkedin.com/in/jorge-christofolli-4b4aaa73/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#0A66C2] hover:text-[#004182] transition-colors font-medium"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <Card className="border-none shadow-elevation">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Qual o assunto da sua mensagem?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva sua necessidade..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
