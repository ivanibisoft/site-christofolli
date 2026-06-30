migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('company_profile')

    try {
      app.findFirstRecordByData('company_profile', 'created', '')
    } catch (_) {
      const record = new Record(col)
      app.save(record)
    }
  },
  (app) => {
    app.db().newQuery('DELETE FROM company_profile').execute()
  },
)
