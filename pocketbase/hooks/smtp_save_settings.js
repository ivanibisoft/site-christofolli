routerAdd(
  'POST',
  '/backend/v1/smtp/settings',
  (e) => {
    try {
      var body = e.requestInfo().body || {}
      var settings = $app.settings()

      settings.meta.smtpHost = body.host || ''
      settings.meta.smtpPort = body.port || 587
      settings.meta.smtpUsername = body.username || ''
      settings.meta.smtpPassword = body.password || ''
      settings.meta.smtpAuth = !!body.username
      settings.meta.smtpTLS = body.encryption === 'TLS' || body.encryption === 'SSL'
      settings.meta.senderAddress = body.from_email || ''
      settings.meta.senderName = body.from_name || 'Christófolli Consultoria'

      $app.saveSettings(settings)

      return e.json(200, { success: true })
    } catch (err) {
      $app.logger().error('Failed to save SMTP settings', 'error', err.message)
      return e.json(500, { error: err.message || 'Failed to save SMTP settings' })
    }
  },
  $apis.requireAuth(),
)
