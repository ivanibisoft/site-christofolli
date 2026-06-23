import { Download, GraduationCap, Briefcase, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BIO_TIMELINE } from '@/lib/data'

export default function Sobre() {
  return (
    <div className="py-12 animate-fade-in">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-primary">Sobre o Consultor</h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm border mb-12 flex flex-col md:flex-row gap-8 items-start">
          <img
            src="https://img.usecurling.com/ppl/medium?gender=male&seed=99"
            alt="Jorge Luiz Christofolli"
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
              da TOP CON Consultoria, com vasta experiência em controle de qualidade, estatística,
              concretos especiais, CAD/CAA, comportamento térmico e sustentabilidade.
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
      </div>
    </div>
  )
}
