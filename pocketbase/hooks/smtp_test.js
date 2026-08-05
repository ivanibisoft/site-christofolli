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
      var adminEmail = (body.admin_email || '').trim()

      if (!host) {
        return e.json(200, { success: false, error: 'Host SMTP é obrigatório.' })
      }
      if (!fromEmail) {
        return e.json(200, { success: false, error: 'E-mail remetente é obrigatório.' })
      }
      if (!adminEmail) {
        return e.json(200, {
          success: false,
          error:
            'E-mail do administrador é obrigatório para o teste de conexão. Configure o e-mail do administrador primeiro.',
        })
      }

      try {
        var client = $app.newMailClient({
          host: host,
          port: port,
          username: username,
          password: password,
          tls: encryption === 'TLS' || encryption === 'SSL',
          auth: username ? 'PLAIN' : '',
        })

        var msg = new MailerMessage({
          from: { address: fromEmail, name: fromName },
          to: [{ address: adminEmail }],
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
