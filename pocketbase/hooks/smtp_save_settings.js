routerAdd(
  'POST',
  '/backend/v1/smtp/settings',
  (e) => {
    try {
      var body = e.requestInfo().body || {}

      var data = {
        host: body.host || '',
        port: body.port || 587,
        username: body.username || '',
        password: body.password || '',
        encryption: body.encryption || 'TLS',
        from_email: body.from_email || '',
        from_name: body.from_name || 'Christófolli Consultoria',
      }

      var col = $app.findCollectionByNameOrId('smtp_settings')

      var record = null
      try {
        var existing = $app.findRecordsByFilter('smtp_settings', '', '', 1, 0)
        if (existing.length > 0) {
          record = existing[0]
        }
      } catch (_) {}

      if (record) {
        record.set('host', data.host)
        record.set('port', data.port)
        record.set('username', data.username)
        record.set('password', data.password)
        record.set('encryption', data.encryption)
        record.set('from_email', data.from_email)
        record.set('from_name', data.from_name)
        $app.save(record)
      } else {
        record = new Record(col)
        record.set('host', data.host)
        record.set('port', data.port)
        record.set('username', data.username)
        record.set('password', data.password)
        record.set('encryption', data.encryption)
        record.set('from_email', data.from_email)
        record.set('from_name', data.from_name)
        $app.save(record)
      }

      try {
        var s = $app.settings()
        s.smtp.host = data.host
        s.smtp.port = data.port
        s.smtp.username = data.username
        s.smtp.password = data.password
        s.smtp.tls = data.encryption === 'TLS' || data.encryption === 'SSL'
        s.smtp.auth = data.username ? 'PLAIN' : ''
        s.meta.senderAddress = data.from_email
        s.meta.senderName = data.from_name
        $app.save(s)
      } catch (settingsErr) {
        $app.logger().error('Failed to update native mail settings', 'error', settingsErr.message)
      }

      return e.json(200, { success: true })
    } catch (err) {
      $app.logger().error('Failed to save SMTP settings', 'error', err.message)
      return e.json(500, { error: err.message || 'Failed to save SMTP settings' })
    }
  },
  $apis.requireAuth(),
)
