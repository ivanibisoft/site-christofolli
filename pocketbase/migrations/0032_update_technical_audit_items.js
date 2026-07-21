migrate(
  (app) => {
    const title = 'Auditoria Tecnológica e Controle das Formulações'
    const newEvaluatedItems = [
      'Formulações e traços utilizados – Método de dosagem, adaptação às condições de logística de entregas e velocidade de atendimento às solicitações dos clientes',
      'Consumo de cimento por MPa',
      'Análise estatística das resistências – efetividade e velocidade dos ajustes de MCC',
      'Controle de abatimento (slump), umidade e água adicionada na central e obra',
      'Ensaios laboratoriais dos insumos e rastreabilidade da produção (Índice de amostragem e procedimentos de moldagem, coleta, desforma, cura, capeamento, rompimento, lançamento de dados e disponibilização para acessos externos ou informativos aos clientes)',
      'Padronização operacional e treinamento da mão de obra de laboratório',
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
      'Formulações e traços utilizados',
      'Consumo de cimento por MPa e eficiência dos aditivos',
      'Variabilidade estatística da resistência',
      'Controle de abatimento (slump), umidade e água',
      'Ensaios laboratoriais e rastreabilidade da produção',
      'Padronização operacional',
    ].join('\n')

    try {
      const record = app.findFirstRecordByData(
        'audit_services',
        'title',
        'Auditoria Tecnológica e Controle das Formulações',
      )
      record.set('evaluated_items', originalEvaluatedItems)
      app.save(record)
    } catch (_) {
      // record not found — skip
    }
  },
)
