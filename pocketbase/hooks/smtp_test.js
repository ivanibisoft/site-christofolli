routerAdd(
  'POST',
  '/backend/v1/smtp_test',
  (e) => {
    try {
      var body = e.requestInfo().body || {}

      var host = (body.host || '').trim()
      var port = body.port || 587
      var username = (body.username || '').trim()
      var password = body.password || ''
      var encryption = body.encryption || 'none'
      var fromEmail = (body.from_email || '').trim()
      var fromName = (body.from_name || '').trim() || 'Christófolli Consultoria'

      if (!host) {
        return e.json(200, { success: false, error: 'Host SMTP é obrigatório.' })
      }
      if (!fromEmail) {
        return e.json(200, { success: false, error: 'E-mail remetente é obrigatório.' })
      }

      var settings = $app.settings()
      var origHost = settings.meta.smtpHost
      var origPort = settings.meta.smtpPort
      var origUsername = settings.meta.smtpUsername
      var origPassword = settings.meta.smtpPassword
      var origAuth = settings.meta.smtpAuth
      var origTLS = settings.meta.smtpTLS
      var origSenderAddress = settings.meta.senderAddress
      var origSenderName = settings.meta.senderName

      settings.meta.smtpHost = host
      settings.meta.smtpPort = port
      settings.meta.smtpUsername = username
      settings.meta.smtpPassword = password
      settings.meta.smtpAuth = !!username
      settings.meta.smtpTLS = encryption === 'TLS' || encryption === 'SSL'
      settings.meta.senderAddress = fromEmail
      settings.meta.senderName = fromName

      try {
        var msg = new MailerMessage({
          from: { address: fromEmail, name: fromName },
          to: [{ address: fromEmail }],
          subject: 'Teste de Configuração SMTP',
          html: '<div style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto;"><p>Este é um e-mail de teste enviado a partir das configurações SMTP.</p></div>',
          text: 'Este é um e-mail de teste enviado a partir das configurações SMTP.',
        })

        $app.newMailClient().send(msg)

        return e.json(200, { success: true })
      } catch (sendErr) {
        return e.json(200, {
          success: false,
          error: sendErr.message || 'Falha ao enviar e-mail de teste.',
        })
      } finally {
        settings.meta.smtpHost = origHost
        settings.meta.smtpPort = origPort
        settings.meta.smtpUsername = origUsername
        settings.meta.smtpPassword = origPassword
        settings.meta.smtpAuth = origAuth
        settings.meta.smtpTLS = origTLS
        settings.meta.senderAddress = origSenderAddress
        settings.meta.senderName = origSenderName
      }
    } catch (err) {
      $app.logger().error('SMTP test failed', 'error', err.message)
      return e.json(200, {
        success: false,
        error: err.message || 'Erro desconhecido ao testar configuração SMTP.',
      })
    }
  },
  $apis.requireAuth(),
)
