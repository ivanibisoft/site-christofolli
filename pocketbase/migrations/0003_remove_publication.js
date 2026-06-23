migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'publications',
        'title',
        'Influence of specific surface area of limestone filler on the cement hydration and properties of cement-based materials',
      )
      app.delete(record)
    } catch (_) {
      // Record not found, safe to skip
    }
  },
  (app) => {
    try {
      app.findFirstRecordByData(
        'publications',
        'title',
        'Influence of specific surface area of limestone filler on the cement hydration and properties of cement-based materials',
      )
    } catch (_) {
      const col = app.findCollectionByNameOrId('publications')
      const record = new Record(col)
      record.set(
        'title',
        'Influence of specific surface area of limestone filler on the cement hydration and properties of cement-based materials',
      )
      record.set('link', '#')
      app.save(record)
    }
  },
)
