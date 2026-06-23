import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const strengthData = [
  { month: 'Jan', original: 30, otimizado: 31, cimentoOrig: 350, cimentoOtim: 320 },
  { month: 'Fev', original: 30.5, otimizado: 31.5, cimentoOrig: 350, cimentoOtim: 318 },
  { month: 'Mar', original: 29.8, otimizado: 31.2, cimentoOrig: 350, cimentoOtim: 315 },
  { month: 'Abr', original: 30.2, otimizado: 31.8, cimentoOrig: 350, cimentoOtim: 310 },
  { month: 'Mai', original: 30, otimizado: 32, cimentoOrig: 350, cimentoOtim: 305 },
  { month: 'Jun', original: 31, otimizado: 32.5, cimentoOrig: 350, cimentoOtim: 300 },
]

const thermalData = [
  { hora: '0h', nucleo: 25, superficie: 25, ambiente: 20 },
  { hora: '24h', nucleo: 45, superficie: 35, ambiente: 22 },
  { hora: '48h', nucleo: 65, superficie: 45, ambiente: 21 },
  { hora: '72h', nucleo: 58, superficie: 42, ambiente: 23 },
  { hora: '96h', nucleo: 48, superficie: 38, ambiente: 20 },
  { hora: '120h', nucleo: 40, superficie: 32, ambiente: 19 },
]

export default function Portfolio() {
  return (
    <div className="py-12 animate-fade-in">
      <div className="container">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Portfólio & Inteligência de Dados</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Resultados comprovados através da aplicação de métodos estatísticos e controle rigoroso
            em grandes obras de infraestrutura e edificações.
          </p>
        </div>

        {/* Gallery */}
        <h2 className="text-2xl font-bold text-primary mb-6">Galeria de Obras Assessoradas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            { img: 'foundation', title: 'Fundações Massivas', q: 'construction%20foundation' },
            { img: 'bridge', title: 'Infraestrutura Viária', q: 'concrete%20bridge' },
            { img: 'tower', title: 'Edifícios Altos (CAD)', q: 'modern%20skyscraper' },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-muted"
            >
              <img
                src={`https://img.usecurling.com/p/600/450?q=${item.q}&color=gray`}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <h2 className="text-2xl font-bold text-primary mb-6">Resultados Estatísticos (Exemplos)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Otimização de Consumo vs. Resistência</CardTitle>
              <CardDescription>
                Comparativo do consumo de cimento (kg/m³) mantendo a resistência fck = 30MPa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  cimentoOrig: { label: 'Consumo Original', color: 'hsl(var(--secondary))' },
                  cimentoOtim: { label: 'Consumo Otimizado', color: 'hsl(var(--accent))' },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={strengthData}
                    margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} domain={[250, 400]} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      dataKey="cimentoOrig"
                      fill="var(--color-cimentoOrig)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="cimentoOtim"
                      fill="var(--color-cimentoOtim)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comportamento Térmico (Simulação)</CardTitle>
              <CardDescription>
                Evolução da temperatura em bloco de fundação de 3.800m³ (Núcleo vs Superfície)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  nucleo: { label: 'Temp. Núcleo (°C)', color: 'hsl(var(--destructive))' },
                  superficie: { label: 'Temp. Superfície (°C)', color: 'hsl(var(--primary))' },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={thermalData}
                    margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="hora" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="nucleo"
                      stroke="var(--color-nucleo)"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="superficie"
                      stroke="var(--color-superficie)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
