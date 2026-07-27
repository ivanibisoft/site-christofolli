onRecordAfterCreateSuccess((e) => {
  try {
    var escapeHtml = function (str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    var rawName = e.record.getString('name')
    var rawEmail = e.record.getString('email')
    var rawSubject = e.record.getString('subject') || 'Sem Assunto'
    var rawCompany = e.record.getString('company_name') || '-'
    var rawWhatsapp = e.record.getString('whatsapp') || '-'
    var rawMessage = e.record.getString('message')

    var name = escapeHtml(rawName)
    var email = escapeHtml(rawEmail)
    var subject = escapeHtml(rawSubject)
    var company = escapeHtml(rawCompany)
    var whatsapp = escapeHtml(rawWhatsapp)
    var messageText = escapeHtml(rawMessage).replace(/\n/g, '<br />')

    var senderAddress = $app.settings().meta.senderAddress
    var senderName = $app.settings().meta.senderName || 'Christófolli Consultoria'

    if (!senderAddress) {
      $app
        .logger()
        .warn(
          'SMTP não configurado — senderAddress vazio. Configure em Settings → Mail no painel do PocketBase.',
        )
      return e.next()
    }

    var htmlBody =
      '<div style="font-family: sans-serif; color: #333;">' +
      '<h2>Novo Contato Recebido</h2>' +
      '<p>Um novo formulário de contato foi enviado através do site.</p>' +
      '<table border="0" cellpadding="5" cellspacing="0" style="text-align: left;">' +
      '<tr><th style="width: 80px;">Nome:</th><td>' +
      name +
      '</td></tr>' +
      '<tr><th>E-mail:</th><td><a href="mailto:' +
      rawEmail +
      '">' +
      email +
      '</a></td></tr>' +
      '<tr><th>Empresa:</th><td>' +
      company +
      '</td></tr>' +
      '<tr><th>WhatsApp:</th><td>' +
      whatsapp +
      '</td></tr>' +
      '<tr><th>Assunto:</th><td>' +
      subject +
      '</td></tr>' +
      '</table>' +
      '<br />' +
      '<p><strong>Mensagem:</strong></p>' +
      '<div style="background: #f4f4f5; padding: 15px; border-radius: 6px; border: 1px solid #e4e4e7;">' +
      messageText +
      '</div>' +
      '</div>'

    var msg = new MailerMessage({
      from: { address: senderAddress, name: senderName },
      to: [{ address: 'jorge@christofolli.com.br' }],
      subject: 'Novo Contato Recebido: ' + rawSubject,
      html: htmlBody,
    })

    $app.newMailClient().send(msg)
  } catch (err) {
    $app
      .logger()
      .error(
        'Erro ao enviar email de notificacao de contato',
        'error',
        err.message,
        'recordId',
        e.record.id,
      )
  }

  e.next()
}, 'contacts')
