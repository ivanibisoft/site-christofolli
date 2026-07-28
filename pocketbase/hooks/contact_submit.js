routerAdd('POST', '/backend/v1/contacts/submit', (e) => {
  var body = e.requestInfo().body || {}

  if (!body.name || !body.email || !body.message) {
    return e.badRequestError('Nome, email e mensagem são obrigatórios')
  }

  var meta = $app.settings().meta
  var senderAddress = meta.senderAddress
  var senderName = meta.senderName || 'Christófolli Consultoria'

  if (!senderAddress) {
    return e.json(400, {
      success: false,
      error:
        'Configurações de e-mail não definidas. Configure o SMTP no painel administrativo antes de receber contatos.',
    })
  }

  var contactId = ''
  try {
    var col = $app.findCollectionByNameOrId('contacts')
    var record = new Record(col)
    record.set('name', body.name)
    record.set('email', body.email)
    record.set('subject', body.subject || '')
    record.set('message', body.message)
    record.set('company_name', body.company_name || '')
    record.set('whatsapp', body.whatsapp || '')
    $app.save(record)
    contactId = record.id
  } catch (err) {
    return e.json(500, { success: false, error: 'Erro ao salvar contato: ' + err.message })
  }

  var esc = function (s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  var firstName = esc(body.name.split(' ')[0] || body.name)
  var errors = []
  var autoSuccess = false
  var adminSuccess = false

  try {
    var autoHtml =
      '<div style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto;">' +
      '<div style="background-color:#1e3a5f;padding:20px;border-radius:8px 8px 0 0;text-align:center;">' +
      '<h1 style="color:#fff;margin:0;font-size:22px;">' +
      esc(senderName) +
      '</h1>' +
      '<p style="color:#c0d4e8;margin:5px 0 0;font-size:14px;">Consultoria Técnica em Concreto</p></div>' +
      '<div style="padding:30px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 8px 8px;">' +
      '<p>Olá, <strong>' +
      firstName +
      '</strong>!</p>' +
      '<p>Agradecemos por entrar em contato com a <strong>' +
      esc(senderName) +
      '</strong>.</p>' +
      '<p>Recebemos sua mensagem e entraremos em contato em breve.</p>' +
      '<div style="background:#f4f4f5;padding:15px;border-radius:6px;border-left:4px solid #1e3a5f;margin:20px 0;">' +
      '<p style="margin:0;font-size:14px;color:#555;"><strong>Prazo de resposta:</strong> Até 2 dias úteis.</p></div>' +
      '<p>Atenciosamente,<br/><strong>Equipe ' +
      esc(senderName) +
      '</strong></p>' +
      '<div style="text-align:center;padding:15px;color:#999;font-size:12px;">' +
      '<p style="margin:0;">Este é um e-mail automático. Por favor, não responda a esta mensagem.</p>' +
      '</div></div></div>'

    $app.newMailClient().send(
      new MailerMessage({
        from: { address: senderAddress, name: senderName },
        to: [{ address: body.email }],
        subject: 'Recebemos seu contato - ' + senderName,
        html: autoHtml,
      }),
    )
    autoSuccess = true
  } catch (err) {
    $app.logger().error('Autoresponder failed', 'error', err.message, 'contactId', contactId)
    errors.push('Falha ao enviar e-mail de auto-resposta: ' + err.message)
  }

  try {
    var adminHtml =
      '<div style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto;">' +
      '<h2>Novo lead recebido</h2>' +
      '<p>Um novo formulário de contato foi enviado através do site.</p>' +
      '<table border="0" cellpadding="5" cellspacing="0" style="text-align:left;">' +
      "<tr><th style='width:80px;'>Nome:</th><td>" +
      esc(body.name) +
      '</td></tr>' +
      '<tr><th>E-mail:</th><td><a href="mailto:' +
      esc(body.email) +
      '">' +
      esc(body.email) +
      '</a></td></tr>' +
      '<tr><th>Empresa:</th><td>' +
      esc(body.company_name || '-') +
      '</td></tr>' +
      '<tr><th>WhatsApp:</th><td>' +
      esc(body.whatsapp || '-') +
      '</td></tr>' +
      '<tr><th>Assunto:</th><td>' +
      esc(body.subject || 'Sem Assunto') +
      '</td></tr>' +
      '</table><br/>' +
      '<p><strong>Mensagem:</strong></p>' +
      '<div style="background:#f4f4f5;padding:15px;border-radius:6px;border:1px solid #e4e4e7;">' +
      esc(body.message).replace(/\n/g, '<br/>') +
      '</div></div>'

    $app.newMailClient().send(
      new MailerMessage({
        from: { address: senderAddress, name: senderName },
        to: [{ address: senderAddress }],
        subject: 'Novo lead recebido',
        html: adminHtml,
      }),
    )
    adminSuccess = true
  } catch (err) {
    $app.logger().error('Admin notification failed', 'error', err.message, 'contactId', contactId)
    errors.push('Falha ao enviar notificação ao administrador: ' + err.message)
  }

  if (!autoSuccess || !adminSuccess) {
    return e.json(200, {
      success: false,
      error: errors.join('; '),
    })
  }

  return e.json(200, { success: true })
})
