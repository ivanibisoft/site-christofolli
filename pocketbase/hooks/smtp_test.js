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

      try {
        var client = $app.newMailClient()
        client.host = host
        client.port = port
        client.username = username
        client.password = password
        client.tls = encryption === 'TLS' || encryption === 'SSL'
        client.auth = !!username

        var msg = new MailerMessage({
          from: { address: fromEmail, name: fromName },
          to: [{ address: fromEmail }],
          subject: 'Teste de Configuração SMTP',
          html: '<div style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto;"><p>Este é um e-mail de teste enviado a partir das configurações SMTP.</p></div>',
          text: 'Este é um e-mail de teste enviado a partir das configurações SMTP.',
        })

        client.send(msg)

        return e.json(200, { success: true })
      } catch (sendErr) {
        return e.json(200, {
          success: false,
          error: 'Falha no teste: ' + (sendErr.message || 'Erro desconhecido ao enviar e-mail.'),
        })
      }
    } catch (err) {
      $app.logger().error('SMTP test failed', 'error', err.message)
      return e.json(200, {
        success: false,
        error: 'Falha no teste: ' + (err.message || 'Erro desconhecido.'),
      })
    }
  },
  $apis.requireAuth(),
)
