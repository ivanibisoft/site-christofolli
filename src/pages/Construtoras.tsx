import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Check, Loader2, FlaskConical, Thermometer, Leaf, LineChart } from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getBuilderServices, type BuilderService } from '@/services/builder-services'
import { useRealtime } from '@/hooks/use-realtime'

const ICON_MAP: Record<string, LucideIcon> = {
  Flask: FlaskConical,
  FlaskConical,
  Thermometer,
  Leaf,
  LineChart,
}

function StandardListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-sm flex items-start gap-2 space-y-0">
      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  )
}

export default function Construtoras() {
  const [services, setServices] = useState<BuilderService[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    getBuilderServices()
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('builder_services', () => {
    loadData()
  })

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Carregando serviços...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service) => {
              const Icon = (service.icon && ICON_MAP[service.icon]) || LineChart
              const topics = service.topics ? service.topics.split('\n').filter(Boolean) : []
              return (
                <Card key={service.id} className="hover:border-accent transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    {service.description && (
                      <CardDescription>{service.description}</CardDescription>
                    )}
                  </CardHeader>
                  {topics.length > 0 && (
                    <CardContent>
                      <ul className="space-y-2 font-medium text-slate-700">
                        {topics.map((topic, idx) => (
                          <StandardListItem key={idx}>{topic.trim()}</StandardListItem>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        )}

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
