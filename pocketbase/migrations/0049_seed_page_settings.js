migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('page_settings')

    const seeds = [
      {
        page: 'construtoras',
        title: 'Engenharia de Estruturas Otimizadas',
        description:
          'Aumente a durabilidade, reduza seções estruturais e evite patologias com soluções inteligentes de concreto.',
        subtitle: '',
      },
      {
        page: 'concreteiras',
        title: 'Consultoria Técnica, Operacional e Administrativa',
        description:
          'Uma avaliação 360º da sua central dosadora, desde a qualidade das matérias-primas até a entrega do concreto na obra.',
        subtitle: 'Escopo dos Serviços de Consultoria',
      },
    ]

    for (const seed of seeds) {
      try {
        app.findFirstRecordByData('page_settings', 'page', seed.page)
        // already exists — skip
      } catch (_) {
        const record = new Record(col)
        record.set('page', seed.page)
        record.set('title', seed.title)
        record.set('description', seed.description)
        record.set('subtitle', seed.subtitle)
        app.save(record)
      }
    }
  },
  (app) => {
    const pages = ['construtoras', 'concreteiras']
    for (const page of pages) {
      try {
        const record = app.findFirstRecordByData('page_settings', 'page', page)
        app.delete(record)
      } catch (_) {}
    }
  },
)
