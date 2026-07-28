routerAdd(
  'GET',
  '/backend/v1/smtp/settings',
  (e) => {
    try {
      var record = null
      try {
        var existing = $app.findRecordsByFilter('smtp_settings', '', '', 1, 0)
        if (existing.length > 0) {
          record = existing[0]
        }
      } catch (_) {}

      if (!record) {
        return e.json(200, {
          host: '',
          port: 587,
          username: '',
          password: '',
          encryption: 'TLS',
          from_email: '',
          from_name: 'Christófolli Consultoria',
        })
      }

      return e.json(200, {
        host: record.getString('host') || '',
        port: record.getInt('port') || 587,
        username: record.getString('username') || '',
        password: record.getString('password') || '',
        encryption: record.getString('encryption') || 'TLS',
        from_email: record.getString('from_email') || '',
        from_name: record.getString('from_name') || '',
      })
    } catch (err) {
      return e.json(500, { error: 'Failed to read SMTP settings: ' + err.message })
    }
  },
  $apis.requireAuth(),
)
