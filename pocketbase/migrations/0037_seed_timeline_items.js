migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('timeline_items')

    const seeds = [
      {
        title: 'Doutorado em Construção Civil',
        institution: 'Universidade Federal do Paraná (UFPR)',
        description:
          'Tese: "Estudo do empacotamento de micro-compósitos em misturas quaternárias de cimento Portland com o uso do método de Monte Carlo com ênfase na redução das emissões de CO2".',
        period: '2015 - 2020',
        type: 'academic',
        order: 1,
      },
      {
        title: 'Mestrado em Construção Civil',
        institution: 'Universidade Federal do Paraná (UFPR)',
        description:
          'Estudo de argilas calcinadas para produção de cimento portland pozolânico na região de Curitiba.',
        period: '2008 - 2010',
        type: 'academic',
        order: 2,
      },
      {
        title: 'Gerente Corporativo de Des. Técnico',
        institution: 'Cia de Cimento Itambé',
        description:
          'Atuação no desenvolvimento técnico, controle de qualidade, estatística, concretos especiais e redução de emissões.',
        period: '2004 - 2026',
        type: 'professional',
        order: 3,
      },
      {
        title: 'Engenheiro de Des. Técnico / Automação',
        institution: 'Lafarge - Concrebras',
        description: 'Implementação de soluções técnicas e automatização de centrais de concreto.',
        period: '1996 - 2004',
        type: 'professional',
        order: 4,
      },
    ]

    seeds.forEach((seed) => {
      try {
        app.findFirstRecordByData('timeline_items', 'title', seed.title)
      } catch (_) {
        const record = new Record(col)
        record.set('title', seed.title)
        record.set('institution', seed.institution)
        record.set('description', seed.description)
        record.set('period', seed.period)
        record.set('type', seed.type)
        record.set('order', seed.order)
        app.save(record)
      }
    })
  },
  (app) => {
    const items = app.findRecordsByFilter('timeline_items', '', '', 0, 0)
    items.forEach((item) => app.delete(item))
  },
)
