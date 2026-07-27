onRecordAfterCreateSuccess((e) => {
  try {
    var rawName = e.record.getString('name')
    var email = e.record.getString('email')
    var rawSubject = e.record.getString('subject') || 'Sem Assunto'

    var escapeHtml = function (str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    var firstName = escapeHtml(rawName.split(' ')[0] || rawName)
    var subject = escapeHtml(rawSubject)

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
      '<div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">' +
      '<div style="background-color: #1e3a5f; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">' +
      '<h1 style="color: #ffffff; margin: 0; font-size: 22px;">Christófolli Consultoria</h1>' +
      '<p style="color: #c0d4e8; margin: 5px 0 0 0; font-size: 14px;">Consultoria Técnica em Concreto</p>' +
      '</div>' +
      '<div style="padding: 30px; border: 1px solid #e4e4e7; border-top: none; border-radius: 0 0 8px 8px;">' +
      '<p style="font-size: 16px;">Olá, <strong>' +
      firstName +
      '</strong>!</p>' +
      '<p>Agradecemos por entrar em contato com a <strong>Christófolli Consultoria</strong>.</p>' +
      '<p>Recebemos sua mensagem com o assunto <strong>"' +
      subject +
      '"</strong> e queremos confirmar que ela foi registrada com sucesso em nosso sistema.</p>' +
      '<p>Nossa equipe técnica irá analisar sua solicitação e entraremos em contato em breve para fornecer o atendimento necessário.</p>' +
      '<div style="background: #f4f4f5; padding: 15px; border-radius: 6px; border-left: 4px solid #1e3a5f; margin: 20px 0;">' +
      '<p style="margin: 0; font-size: 14px; color: #555;">' +
      '<strong>Prazo de resposta:</strong> Até 2 dias úteis.<br />' +
      'Caso tenha urgência, entre em contato diretamente pelo WhatsApp.' +
      '</p>' +
      '</div>' +
      '<p>Atenciosamente,</p>' +
      '<p style="margin-top: 5px;">' +
      '<strong>Equipe Christófolli Consultoria</strong><br />' +
      '<span style="color: #888; font-size: 14px;">Consultoria Técnica em Concreto</span>' +
      '</p>' +
      '</div>' +
      '<div style="text-align: center; padding: 15px; color: #999; font-size: 12px;">' +
      '<p style="margin: 0;">Este é um e-mail automático. Por favor, não responda a esta mensagem.</p>' +
      '</div>' +
      '</div>'

    var msg = new MailerMessage({
      from: { address: senderAddress, name: senderName },
      to: [{ address: email }],
      subject: 'Recebemos sua mensagem - Christófolli Consultoria',
      html: htmlBody,
    })

    $app.newMailClient().send(msg)
  } catch (err) {
    $app
      .logger()
      .error(
        'Erro ao enviar email de auto-resposta para o cliente',
        'error',
        err.message,
        'recordId',
        e.record.id,
      )
  }

  e.next()
}, 'contacts')
