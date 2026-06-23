import { useState, useEffect } from 'react'
import { Download, GraduationCap, Briefcase, FileText, BookOpen, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BIO_TIMELINE } from '@/lib/data'
import { getPublications, type Publication } from '@/services/publications'

export default function Sobre() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublications()
      .then(setPublications)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="py-12 animate-fade-in">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-primary">Sobre o Consultor</h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm border mb-12 flex flex-col md:flex-row gap-8 items-start">
          <img
            src="https://media.licdn.com/dms/image/v2/D4E03AQH0sLrr7QZUcQ/profile-displayphoto-crop_800_800/B4EZtLYlLZKUAI-/0/1766496294844?e=1783555200&v=beta&t=ozGphTIYAGPD6uMJEs2XZIOk8J2JGpyQ2HEnV4o__Cg"
            alt="Jorge Christofolli - Christófolli Consultoria de Engenharia"
            className="w-48 h-48 rounded-xl object-cover shadow-md shrink-0"
          />
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
            <p className="text-slate-600 leading-relaxed">
              Atuou como Gerente Corporativo de Desenvolvimento Técnico em grandes indústrias de
              cimento e concreto (Cia de Cimento Itambé, Lafarge Concrebras). Atualmente é Diretor
              da Christófolli Consultoria de Engenharia Ltda., com vasta experiência em controle de
              qualidade, estatística, concretos especiais, CAD/CAA, comportamento térmico e
              sustentabilidade.
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

        <div className="mt-16">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3 text-primary">
            <BookOpen className="h-8 w-8 text-accent" />
            Publicações e Artigos
          </h3>

          <div className="grid gap-6">
            {publications.map((pub) => (
              <Card key={pub.id} className="hover:border-accent transition-colors shadow-sm">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <h4 className="text-xl font-bold text-slate-800 leading-tight">{pub.title}</h4>
                    {pub.description && <p className="text-slate-600">{pub.description}</p>}
                    {pub.published_date && (
                      <p className="text-sm text-slate-400 font-medium">
                        Publicado em:{' '}
                        {new Date(pub.published_date).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    )}
                  </div>
                  <Button asChild className="shrink-0 bg-primary hover:bg-primary/90 group">
                    <a href={pub.link} target="_blank" rel="noopener noreferrer">
                      Ler Artigo
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}

            {!loading && publications.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500">Nenhuma publicação cadastrada no momento.</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 animate-pulse">
                <p className="text-slate-500">Carregando publicações...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
