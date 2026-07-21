migrate(
  (app) => {
    const bioText =
      'Atuou na gestão técnica de controle de qualidade do cimento, atendimento aos clientes da Cia de Cimento Itambé assim como na divisão de concreto (CONCREBRAS), no desenvolvimento de concretos especiais, análises estatísticas, redução de custos, assistência técnica e apoio em projetos de grande complexidade construtiva.'

    try {
      const records = app.findRecordsByFilter('company_profile', 'id != ""', 'created', 1, 0)
      if (records.length > 0) {
        const record = records[0]
        record.set('director_bio', bioText)
        app.save(record)
      }
    } catch (_) {}
  },
  (app) => {
    try {
      const records = app.findRecordsByFilter('company_profile', 'id != ""', 'created', 1, 0)
      if (records.length > 0) {
        const record = records[0]
        record.set('director_bio', '')
        app.save(record)
      }
    } catch (_) {}
  },
)
