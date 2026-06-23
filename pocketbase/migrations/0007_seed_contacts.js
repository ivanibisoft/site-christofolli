migrate(
  (app) => {
    const contacts = [
      {
        name: 'João Silva',
        email: 'joao.silva@construtora.com.br',
        subject: 'Consultoria para Obra X',
        message:
          'Gostaria de saber mais sobre a consultoria para controle térmico em nossa nova obra.',
      },
      {
        name: 'Maria Souza',
        email: 'maria.souza@concreteira.com.br',
        subject: 'Otimização de traços',
        message: 'Temos interesse em otimizar nossos traços de concreto de alta resistência.',
      },
    ]

    const collection = app.findCollectionByNameOrId('contacts')

    for (const data of contacts) {
      try {
        app.findFirstRecordByData('contacts', 'email', data.email)
      } catch (_) {
        const record = new Record(collection)
        record.set('name', data.name)
        record.set('email', data.email)
        record.set('subject', data.subject)
        record.set('message', data.message)
        app.save(record)
      }
    }
  },
  (app) => {
    const emails = ['joao.silva@construtora.com.br', 'maria.souza@concreteira.com.br']
    for (const email of emails) {
      try {
        const record = app.findFirstRecordByData('contacts', 'email', email)
        app.delete(record)
      } catch (_) {}
    }
  },
)
