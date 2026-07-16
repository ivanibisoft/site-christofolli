migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'gallery_categories',
        'name',
        'Resultados Estatísticos',
      )
      record.set('name', 'Gráficos Estatísticos')
      app.save(record)
    } catch (_) {
      // Category not found — already renamed or never existed
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'gallery_categories',
        'name',
        'Gráficos Estatísticos',
      )
      record.set('name', 'Resultados Estatísticos')
      app.save(record)
    } catch (_) {}
  },
)
