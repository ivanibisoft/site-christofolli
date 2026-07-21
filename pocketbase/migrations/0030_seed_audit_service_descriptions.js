migrate(
  (app) => {
    const descriptions = {
      'Auditoria de Compras e Matérias-Primas':
        'Avaliação dos processos de aquisição, recebimento e consumo de materiais utilizados na produção de concreto.',
      'Auditoria de Controle de Estoque':
        'Análise do sistema de armazenagem, movimentação e controle de estoque físico e contábil.',
      'Auditoria de Manutenção e Equipamentos':
        'Avaliação das condições operacionais e da gestão da manutenção da central dosadora.',
      'Auditoria Tecnológica e Controle das Formulações':
        'Avaliação técnica do sistema de dosagem, traços e controle tecnológico do concreto.',
    }

    for (const [title, description] of Object.entries(descriptions)) {
      try {
        const record = app.findFirstRecordByData('audit_services', 'title', title)
        record.set('description', description)
        app.save(record)
      } catch (_) {
        // record not found — skip
      }
    }
  },
  (app) => {
    app.db().newQuery('UPDATE audit_services SET description = NULL').execute()
  },
)
