import { Link } from 'react-router-dom'
import { Building2, ThermometerSun, Leaf, LineChart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Construtoras() {
  return (
    <div className="py-12 animate-fade-in-up">
      <div className="container">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Building2 className="h-4 w-4" />
            Para Construtoras
          </div>
          <h1 className="text-4xl font-bold mb-4">Engenharia de Estruturas Otimizadas</h1>
          <p className="text-lg text-muted-foreground">
            Aumente a durabilidade, reduza seções estruturais e mitigue riscos técnicos. Nossa
            consultoria apoia construtoras na especificação e controle do concreto ideal para cada
            desafio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:border-accent transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Concretos Especiais (CAD/CAA)</CardTitle>
              <CardDescription>Alto Desempenho e Autoadensável</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Especificação de Concreto de Alto Desempenho (CAD) para permitir pilares mais
                esbeltos, resultando em maior área útil e menor consumo de aço e formas.
              </p>
              <ul className="text-sm space-y-2 font-medium text-slate-700">
                <li>• Redução de volume de concreto</li>
                <li>• Velocidade na desforma</li>
                <li>• Acabamento superior</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:border-accent transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <ThermometerSun className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Comportamento Térmico</CardTitle>
              <CardDescription>Fundações Massivas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Simulação e controle de temperatura em blocos de fundação para evitar fissuração de
                origem térmica. Cálculo de adições e necessidade de resfriamento.
              </p>
              <ul className="text-sm space-y-2 font-medium text-slate-700">
                <li>• Modelagem térmica preditiva</li>
                <li>• Especificação de gelo/nitrogênio</li>
                <li>• Prevenção de RAA e DEF</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:border-accent transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Sustentabilidade (ESG)</CardTitle>
              <CardDescription>Redução da Pegada de Carbono</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                <span id="docs-internal-guid-8f25ad87-7fff-c44c-30e9-5ddd611d2b48">
                  <span>
                    Estudos específicos desde a participação na concepção do projeto estrutural até
                    a aplicação do concreto, visando:
                  </span>
                </span>
              </p>
              <ul className="text-sm space-y-2 font-medium text-slate-700">
                <li>• Redução de emissões de CO2</li>
                <li>• Certificações LEED/AQUA</li>
                <li>• Uso otimizado de adições</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-4">Avaliando um projeto complexo?</h3>
            <p className="text-slate-300">
              Entre em contato para discutirmos como o uso de concretos tecnologicamente avançados
              pode impactar positivamente o cronograma e o custo global da sua obra.
            </p>
          </div>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 shrink-0">
            <Link to="/#contato">Agendar Reunião Técnica</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
