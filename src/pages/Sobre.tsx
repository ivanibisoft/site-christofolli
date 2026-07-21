import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Briefcase, FileText, Linkedin, Eye, Download, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PdfViewerDialog } from '@/components/PdfViewerDialog'
import { BIO_TIMELINE } from '@/lib/data'
import {
  getCompanyProfile,
  getDirectorPhotoUrl,
  type CompanyProfile,
} from '@/services/company-profile'
import { getPublications, type Publication } from '@/services/publications'
import { useRealtime } from '@/hooks/use-realtime'
import { getFileUrl } from '@/lib/file-url'

export default function Sobre() {
  const [directorPhoto, setDirectorPhoto] = useState<string | null>(null)
  const [directorBio, setDirectorBio] = useState<string>('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [publications, setPublications] = useState<Publication[]>([])
  const [pdfViewer, setPdfViewer] = useState<{ url: string; fileName: string } | null>(null)

  const getPdfUrl = useCallback((pub: Publication): string => {
    return getFileUrl(pub, pub.pdf_file || '')
  }, [])

  const loadProfile = () => {
    getCompanyProfile()
      .then((profile) => {
        setDirectorPhoto(getDirectorPhotoUrl(profile))
        setDirectorBio(profile?.director_bio || '')
      })
      .catch(() => {
        setDirectorPhoto(null)
        setDirectorBio('')
      })
      .finally(() => {
        setProfileLoading(false)
      })
  }

  const loadPublications = () => {
    getPublications()
      .then(setPublications)
      .catch(() => {})
  }

  useEffect(() => {
    loadProfile()
    loadPublications()
  }, [])

  useRealtime('company_profile', () => {
    loadProfile()
  })

  useRealtime('publications', () => {
    loadPublications()
  })

  return (
    <div className="py-12 animate-fade-in">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-primary">Sobre o Consultor</h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm border mb-12 flex flex-col md:flex-row gap-8 items-start">
          {profileLoading ? (
            <div className="w-48 h-48 rounded-xl bg-slate-100 animate-pulse shrink-0 flex items-center justify-center">
              <User className="h-16 w-16 text-slate-300" />
            </div>
          ) : directorPhoto ? (
            <img
              src={directorPhoto}
              alt="Jorge Christofolli - Christófolli Consultoria de Engenharia"
              className="w-48 h-48 rounded-xl object-cover shadow-md shrink-0"
            />
          ) : (
            <div className="w-48 h-48 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center">
              <User className="h-16 w-16 text-slate-300" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold mb-2">Jorge Luiz Christofolli</h2>
            <h3 className="text-muted-foreground font-medium mb-6">
              Engenheiro Civil • Doutor • Diretor Técnico
            </h3>

            <p className="text-slate-600 leading-relaxed mb-4">
              Possui graduação em ENGENHARIA CIVIL pela Faculdade de Engenharia São Paulo (1996),
              especialização em Patologia das Construções pela UTFPR (2006), mestrado e doutorado em
              Construção Civil pelo PPGECC da Universidade Federal do Paraná.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {directorBio ||
                'Atuou na gestão técnica de controle de qualidade do cimento, atendimento aos clientes da Cia de Cimento Itambé assim como na divisão de concreto (CONCREBRAS), no desenvolvimento de concretos especiais, análises estatísticas, redução de custos, assistência técnica e apoio em projetos de grande complexidade construtiva.'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-accent" />
              Trajetória Profissional e Acadêmica
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {BIO_TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Briefcase className="h-4 w-4" />
                  </div>

                  <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:border-primary transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-accent text-sm">{item.year}</span>
                      </div>
                      <h4 className="font-bold text-primary mb-1">{item.title}</h4>
                      <div className="text-sm font-medium text-slate-500 mb-2">
                        {item.institution}
                      </div>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Credenciais
            </h3>

            <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
              <CardContent className="p-6 relative z-10">
                <div className="mb-6">
                  <h4 className="text-xl font-bold mb-1">Currículo Lattes</h4>
                  <p className="text-sm text-slate-400">Plataforma CNPq</p>
                </div>

                <div className="space-y-4 text-sm mb-6">
                  <div>
                    <span className="block text-slate-400 mb-1">ID Lattes</span>
                    <span className="font-mono bg-slate-800 px-2 py-1 rounded">
                      7640138691992722
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400 mb-1">Última atualização</span>
                    <span>18/06/2026</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white" asChild>
                    <a
                      href="https://www.linkedin.com/in/jorge-christofolli-4b4aaa73/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="mr-2 h-4 w-4" /> Perfil no LinkedIn
                    </a>
                  </Button>
                  <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                    <a
                      href="https://lattes.cnpq.br/7640138691992722"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Acessar Lattes Completo
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-slate-700 hover:bg-slate-800 text-white"
                    disabled
                  >
                    <Download className="mr-2 h-4 w-4" /> Download PDF (Resumo)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {publications.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-accent" />
              Publicações
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {publications.map((pub) => (
                <Card
                  key={pub.id}
                  className="group hover:border-primary hover:shadow-md transition-all duration-300"
                >
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="h-11 w-11 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-primary mb-1 leading-snug line-clamp-2">
                        {pub.title}
                      </h4>
                      {pub.published_date && (
                        <p className="text-xs text-slate-500 mb-3">
                          {new Date(pub.published_date).toLocaleDateString('pt-BR', {
                            timeZone: 'UTC',
                          })}
                        </p>
                      )}
                      {pub.pdf_file && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          onClick={() =>
                            setPdfViewer({
                              url: getPdfUrl(pub),
                              fileName: pub.pdf_file || 'documento.pdf',
                            })
                          }
                        >
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          Visualizar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold mb-4">Precisa de consultoria especializada?</h3>
              <p className="text-slate-300">
                Entre em contato para entendermos seus desafios e apresentarmos soluções sob medida
                para sua construtora ou concreteira.
              </p>
            </div>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 shrink-0">
              <Link to="/#contato">Fale Conosco</Link>
            </Button>
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-slate-400 hover:text-slate-600"
            >
              <Link to="/admin">Acesso Administrativo</Link>
            </Button>
          </div>
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
    </div>
  )
}
