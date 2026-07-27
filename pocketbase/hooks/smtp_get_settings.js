routerAdd(
  'GET',
  '/backend/v1/smtp/settings',
  (e) => {
    try {
      var meta = $app.settings().meta

      return e.json(200, {
        host: meta.smtpHost || '',
        port: meta.smtpPort || 587,
        username: meta.smtpUsername || '',
        password: meta.smtpPassword || '',
        encryption: meta.smtpTLS ? 'TLS' : 'none',
        from_email: meta.senderAddress || '',
        from_name: meta.senderName || '',
      })
    } catch (err) {
      return e.json(500, { error: 'Failed to read SMTP settings: ' + err.message })
    }
  },
  $apis.requireAuth(),
)
