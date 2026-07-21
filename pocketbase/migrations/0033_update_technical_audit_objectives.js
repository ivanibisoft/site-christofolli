migrate(
  (app) => {
    const title = 'Auditoria Tecnológica e Controle das Formulações'
    const newObjectives = [
      'Redução do consumo de cimento',
      'Otimização de traços',
      'Melhoria da qualidade final e redução da variabilidade',
    ].join('\n')

    try {
      const record = app.findFirstRecordByData('audit_services', 'title', title)
      record.set('objectives_and_deliveries', newObjectives)
      app.save(record)
    } catch (_) {
      // record not found — skip
    }
  },
  (app) => {
    const originalObjectives = [
      'Redução do consumo de cimento',
      'Otimização de traços',
      'Aumento da estabilidade do concreto',
      'Melhoria da qualidade final e redução da variabilidade',
    ].join('\n')

    try {
      const record = app.findFirstRecordByData(
        'audit_services',
        'title',
        'Auditoria Tecnológica e Controle das Formulações',
      )
      record.set('objectives_and_deliveries', originalObjectives)
      app.save(record)
    } catch (_) {
      // record not found — skip
    }
  },
)
