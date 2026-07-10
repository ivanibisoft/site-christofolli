migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('smtp_settings')

    try {
      const count = app.countRecords('smtp_settings')
      if (count > 0) return
    } catch (_) {}

    const record = new Record(col)
    record.set('host', 'smtp.example.com')
    record.set('port', 587)
    record.set('username', 'user@example.com')
    record.set('password', 'changeme')
    record.set('encryption', 'TLS')
    record.set('from_email', 'noreply@example.com')
    record.set('from_name', 'Christófolli Consultoria')
    app.save(record)
  },
  (app) => {
    app.db().newQuery('DELETE FROM smtp_settings').execute()
  },
)
