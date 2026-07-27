routerAdd(
  'POST',
  '/backend/v1/smtp/test',
  (e) => {
    try {
      const body = e.requestInfo().body || {}

      const host = (body.host || '').trim()
      const port = parseInt(body.port, 10)
      const username = (body.username || '').trim()
      const password = (body.password || '').trim()
      const encryption = (body.encryption || 'TLS').trim()
      const fromEmail = (body.from_email || '').trim()
      const fromName = (body.from_name || '').trim()

      if (!host) return e.badRequestError('Host is required')
      if (!port || port < 1 || port > 65535) return e.badRequestError('Valid port is required')
      if (!username) return e.badRequestError('Username is required')
      if (!password) return e.badRequestError('Password is required')
      if (!fromEmail) return e.badRequestError('From email is required')

      const m = 'mailer'
      const mailer = require(m)

      const htmlBody =
        '<div style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto;">' +
        '<div style="background-color:#1e3a5f;padding:20px;border-radius:8px 8px 0 0;text-align:center;">' +
        '<h1 style="color:#fff;margin:0;font-size:22px;">Christófolli Consultoria</h1>' +
        '<p style="color:#c0d4e8;margin:5px 0 0;font-size:14px;">Teste de Configuração SMTP</p>' +
        '</div><div style="padding:30px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 8px 8px;">' +
        '<p>Este é um e-mail de teste enviado a partir do painel administrativo.</p>' +
        '<p>Se você recebeu esta mensagem, sua configuração SMTP está funcionando corretamente.</p>' +
        '<p style="color:#888;font-size:14px;">Host: ' +
        host +
        '<br/>Porta: ' +
        port +
        '<br/>Criptografia: ' +
        encryption +
        '</p>' +
        '</div></div>'

      const msg = new mailer.Message({
        from: { address: fromEmail, name: fromName || fromEmail },
        to: [{ address: fromEmail }],
        subject: 'Teste de Configuração SMTP - Christófolli Consultoria',
        html: htmlBody,
      })

      const client = new mailer.SmtpClient({
        host: host,
        port: port,
        username: username,
        password: password,
        ssl: encryption === 'SSL',
      })

      client.send(msg)

      return e.json(200, { success: true, message: 'Test email sent successfully to ' + fromEmail })
    } catch (err) {
      $app.logger().error('SMTP test failed', 'error', err.message)
      return e.json(400, { success: false, error: err.message || 'Failed to send test email' })
    }
  },
  $apis.requireAuth(),
)
