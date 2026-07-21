migrate(
  (app) => {
    const title = 'Auditoria de Manutenção e Equipamentos'
    const newEvaluatedItems = [
      'Central dosadora – produtividade (tempo de carga, vazões dos materiais em modo pesagem e transferência para CB)',
      'Caminhões betoneira – Calibração de Hidrômetros e pressão do sistema hidráulico (Indicação do Slump Test)',
      'Sistema de pesagem (histórico e periodicidade de calibração das células de carga)',
      'Sensores de umidade (Calibração)',
      'Análise de disponibilidade operacional',
      'Consumo de combustível',
    ].join('\n')

    try {
      const record = app.findFirstRecordByData('audit_services', 'title', title)
      record.set('evaluated_items', newEvaluatedItems)
      app.save(record)
    } catch (_) {
      // record not found — skip
    }
  },
  (app) => {
    const originalEvaluatedItems = [
      'Central dosadora e Misturadores',
      'Caminhões betoneira e Bombas de concreto',
      'Pá carregadeira',
      'Sistema pneumático e de pesagem',
      'Sensores e automação',
      'Plano de manutenção preventiva e histórico corretivo',
      'Custos de manutenção e disponibilidade operacional',
      'Consumo de combustível, índices de parada e vida útil',
    ].join('\n')

    try {
      const record = app.findFirstRecordByData(
        'audit_services',
        'title',
        'Auditoria de Manutenção e Equipamentos',
      )
      record.set('evaluated_items', originalEvaluatedItems)
      app.save(record)
    } catch (_) {
      // record not found — skip
    }
  },
)
