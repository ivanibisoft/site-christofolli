import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Factory, CheckCircle, FileText, CircleCheckBig, Loader2 } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAuditServices, type AuditService } from '@/services/audit-services'
import { useRealtime } from '@/hooks/use-realtime'

export default function Concreteiras() {
  const [modules, setModules] = useState<AuditService[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    getAuditServices()
      .then(setModules)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('audit_services', () => {
    loadData()
  })

  return (
    <div className="py-12 animate-fade-in">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            <Factory className="h-4 w-4" />
            Para Concreteiras
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Auditoria Técnica, Operacional e Administrativa
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma avaliação 360º da sua central dosadora visando identificar oportunidades de
            melhoria, redução de custos e aumento de produtividade.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-subtle p-8 border border-slate-100 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-primary border-b pb-4">
            Escopo dos Serviços de Auditoria
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p>Carregando serviços...</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {modules.map((module, index) => {
                const itemNumber = String(index + 1).padStart(2, '0')
                return (
                  <AccordionItem
                    value={module.id}
                    key={module.id}
                    className="border-b border-slate-100"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:text-accent py-4 text-left">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-accent font-bold text-xl shrink-0 leading-tight">
                          {itemNumber}.
                        </span>
                        <span>{module.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pb-6">
                      <div className="pl-8 sm:pl-10">
                        {module.description && (
                          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            {module.description}
                          </p>
                        )}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                              <FileText className="h-4 w-4" /> Itens Avaliados
                            </h4>
                            <ul className="space-y-2">
                              {module.evaluated_items
                                .split('\n')
                                .filter(Boolean)
                                .map((item, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <span className="text-accent mt-0.5">•</span>
                                    <span>{item.trim()}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" /> Objetivos e Entregas
                            </h4>
                            <ul className="space-y-2">
                              {module.objectives_and_deliveries
                                .split('\n')
                                .filter(Boolean)
                                .map((item, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <CircleCheckBig className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>{item.trim()}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-primary text-white border-none">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-white">Metodologia de Trabalho</h3>
              <ul className="space-y-3 text-slate-200">
                <li className="flex items-center gap-3">✓ Visitas técnicas presenciais</li>
                <li className="flex items-center gap-3">✓ Entrevistas com equipes operacionais</li>
                <li className="flex items-center gap-3">
                  ✓ Levantamento de dados e análise documental
                </li>
                <li className="flex items-center gap-3">✓ Análise estatística de produção</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-accent text-white border-none">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">Entregáveis ao Final</h3>
              <ul className="space-y-3 text-orange-100">
                <li className="flex items-center gap-3">
                  ✓ Relatório técnico completo e diagnóstico
                </li>
                <li className="flex items-center gap-3">
                  ✓ Mapeamento de oportunidades de redução de custos
                </li>
                <li className="flex items-center gap-3">
                  ✓ Plano de ações corretivas e preventivas
                </li>
                <li className="flex items-center gap-3">✓ Sugestões de otimização tecnológica</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 h-14 px-8 text-lg shadow-xl"
          >
            <Link to="/#contato">Solicitar Proposta Comercial</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Confidencialidade absoluta: todas as informações técnicas e financeiras são tratadas com
            rigoroso sigilo.
          </p>
        </div>
      </div>
    </div>
  )
}
