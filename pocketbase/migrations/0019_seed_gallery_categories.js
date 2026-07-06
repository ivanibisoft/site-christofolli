migrate(
  (app) => {
    const categories = ['Obras', 'Equipe', 'Eventos', 'Projetos', 'Ensaios']
    const collection = app.findCollectionByNameOrId('gallery_categories')

    for (const name of categories) {
      try {
        app.findFirstRecordByData('gallery_categories', 'name', name)
      } catch (_) {
        const record = new Record(collection)
        record.set('name', name)
        app.save(record)
      }
    }
  },
  (app) => {
    app.db().newQuery('DELETE FROM gallery_categories').execute()
  },
)
