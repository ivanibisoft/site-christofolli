migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('publications')

    // Idempotent: skip if publication already exists
    try {
      app.findFirstRecordByData(
        'publications',
        'title',
        'Use of high-energy milling for reducing CO2 emissions in quaternary blends of Portland cement',
      )
      return
    } catch (_) {}

    const record = new Record(collection)
    record.set(
      'title',
      'Use of high-energy milling for reducing CO2 emissions in quaternary blends of Portland cement',
    )
    record.set('link', '#') // Placeholder link as it is a required field
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'publications',
        'title',
        'Use of high-energy milling for reducing CO2 emissions in quaternary blends of Portland cement',
      )
      app.delete(record)
    } catch (_) {}
  },
)
