routerAdd(
  'POST',
  '/backend/v1/smtp/test',
  (e) => {
    try {
      var body = e.requestInfo().body || {}
      var toEmail = (body.to || '').trim()

      if (body.host !== undefined) {
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
      }

      var senderAddress = $app.settings().meta.senderAddress
      var senderName = $app.settings().meta.senderName || 'Christófolli Consultoria'

      if (!senderAddress) {
        return e.json(400, {
          success: false,
          error:
            'SMTP não configurado. Configure o remetente em Settings → Mail no painel do PocketBase.',
        })
      }

      if (!toEmail) {
        toEmail = senderAddress
      }

      var htmlBody =
        '<div style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto;">' +
        '<div style="background-color:#1e3a5f;padding:20px;border-radius:8px 8px 0 0;text-align:center;">' +
        '<h1 style="color:#fff;margin:0;font-size:22px;">Christófolli Consultoria</h1>' +
        '<p style="color:#c0d4e8;margin:5px 0 0;font-size:14px;">Teste de Configuração SMTP</p>' +
        '</div><div style="padding:30px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 8px 8px;">' +
        '<p>Este é um e-mail de teste enviado a partir do painel administrativo.</p>' +
        '<p>Se você recebeu esta mensagem, sua configuração SMTP está funcionando corretamente.</p>' +
        '<p style="color:#888;font-size:14px;">Remetente: ' +
        senderName +
        ' &lt;' +
        senderAddress +
        '&gt;<br/>Destinatário: ' +
        toEmail +
        '</p>' +
        '</div></div>'

      var msg = new MailerMessage({
        from: { address: senderAddress, name: senderName },
        to: [{ address: toEmail }],
        subject: 'Teste de Configuração SMTP - Christófolli Consultoria',
        html: htmlBody,
      })

      $app.newMailClient().send(msg)

      return e.json(200, {
        success: true,
        message: 'E-mail de teste enviado com sucesso para ' + toEmail,
      })
    } catch (err) {
      $app.logger().error('SMTP test failed', 'error', err.message)
      return e.json(400, {
        success: false,
        error:
          err.message ||
          'Falha ao enviar e-mail de teste. Verifique a configuração SMTP em Settings → Mail.',
      })
    }
  },
  $apis.requireAuth(),
)
