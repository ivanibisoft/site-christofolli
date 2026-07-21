migrate(
  (app) => {
    const items = [
      {
        title: 'Auditoria de Compras e Matérias-Primas',
        evaluated_items: [
          'Critérios para escolha e compra de cimento',
          'Critérios para escolha e compra de agregados (britas e areias)',
          'Critérios para escolha e compra de aditivos químicos e adições minerais',
          'Verificação de desperdícios e perdas operacionais',
          'Análise de consumo específico por m³ produzido',
        ].join('\n'),
        objectives_and_deliveries: [
          'Redução de custos de insumos',
          'Padronização técnica dos materiais',
          'Melhor previsibilidade de consumo',
          'Redução de perdas e desvios',
        ].join('\n'),
        order: 1,
      },
      {
        title: 'Auditoria de Controle de Estoque',
        evaluated_items: [
          'Controle de entrada e saída de materiais (pedidos e baixas de estoque)',
          'Inventários físicos',
          'Diferenças entre estoque físico e sistema contábil',
          'Controle de umidade dos agregados e perdas associadas',
          'Perdas por contaminação ou armazenagem inadequada',
          'Gestão de silos e tanques',
          'Indicadores de consumo',
        ].join('\n'),
        objectives_and_deliveries: [
          'Melhor rastreabilidade',
          'Redução de perdas',
          'Maior confiabilidade dos estoques',
          'Controle financeiro mais preciso',
        ].join('\n'),
        order: 2,
      },
      {
        title: 'Auditoria de Manutenção e Equipamentos',
        evaluated_items: [
          'Central dosadora e Misturadores',
          'Caminhões betoneira e Bombas de concreto',
          'Pá carregadeira',
          'Sistema pneumático e de pesagem',
          'Sensores e automação',
          'Plano de manutenção preventiva e histórico corretivo',
          'Custos de manutenção e disponibilidade operacional',
          'Consumo de combustível, índices de parada e vida útil',
        ].join('\n'),
        objectives_and_deliveries: [
          'Redução de paradas',
          'Maior confiabilidade operacional',
          'Redução de custos de manutenção',
          'Aumento de produtividade',
        ].join('\n'),
        order: 3,
      },
      {
        title: 'Auditoria Tecnológica e Controle das Formulações',
        evaluated_items: [
          'Formulações e traços utilizados',
          'Consumo de cimento por MPa e eficiência dos aditivos',
          'Variabilidade estatística da resistência',
          'Controle de abatimento (slump), umidade e água',
          'Ensaios laboratoriais e rastreabilidade da produção',
          'Padronização operacional',
        ].join('\n'),
        objectives_and_deliveries: [
          'Redução do consumo de cimento',
          'Otimização de traços',
          'Aumento da estabilidade do concreto',
          'Melhoria da qualidade final e redução da variabilidade',
        ].join('\n'),
        order: 4,
      },
    ]

    const col = app.findCollectionByNameOrId('audit_services')

    for (const item of items) {
      try {
        app.findFirstRecordByData('audit_services', 'title', item.title)
      } catch (_) {
        const record = new Record(col)
        record.set('title', item.title)
        record.set('evaluated_items', item.evaluated_items)
        record.set('objectives_and_deliveries', item.objectives_and_deliveries)
        record.set('order', item.order)
        app.save(record)
      }
    }
  },
  (app) => {
    app.db().newQuery('DELETE FROM audit_services').execute()
  },
)
