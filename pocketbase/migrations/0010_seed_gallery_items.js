migrate(
  (app) => {
    const items = [
      {
        title: 'Ensaio de Compressão de Concreto',
        category: 'Ensaios',
        description: 'Ensaio de resistência à compressão realizado aos 28 dias.',
      },
      {
        title: 'Ensaio de Abatimento (Slump Test)',
        category: 'Ensaios',
        description: 'Verificação da consistência e trabalhabilidade do concreto.',
      },
      {
        title: 'Acompanhamento de Obra Estrutural',
        category: 'Obras',
        description: 'Concretagem de laje de transição em edifício de múltiplos pavimentos.',
      },
      {
        title: 'Fundação Massiva',
        category: 'Obras',
        description: 'Bloco de fundação com controle de temperatura.',
      },
    ]

    for (const item of items) {
      try {
        app.findFirstRecordByData('gallery_items', 'title', item.title)
      } catch (_) {
        // Bypassing file validation using raw SQL to insert seed data smoothly
        app
          .db()
          .newQuery(`
          INSERT INTO gallery_items (id, title, category, description, created, updated)
          VALUES ({:id}, {:title}, {:category}, {:description}, {:created}, {:updated})
        `)
          .bind({
            id: $security.randomString(15),
            title: item.title,
            category: item.category,
            description: item.description,
            created: new Date().toISOString().replace('T', ' ').replace('Z', 'Z'),
            updated: new Date().toISOString().replace('T', ' ').replace('Z', 'Z'),
          })
          .execute()
      }
    }
  },
  (app) => {
    app.db().newQuery(`DELETE FROM gallery_items`).execute()
  },
)
