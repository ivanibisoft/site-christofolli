migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('gallery_categories')
    try {
      app.findFirstRecordByData('gallery_categories', 'name', 'Resultados Estatísticos')
    } catch (_) {
      const record = new Record(collection)
      record.set('name', 'Resultados Estatísticos')
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'gallery_categories',
        'name',
        'Resultados Estatísticos',
      )
      app.delete(record)
    } catch (_) {}
  },
)
