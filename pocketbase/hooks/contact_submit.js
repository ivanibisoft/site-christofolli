routerAdd('POST', '/backend/v1/contacts/submit', (e) => {
  var body = e.requestInfo().body || {}

  var missingFields = {}
  if (!body.name)
    missingFields.name = new ValidationError('validation_required', 'O nome é obrigatório')
  if (!body.email)
    missingFields.email = new ValidationError('validation_required', 'O email é obrigatório')
  if (!body.subject)
    missingFields.subject = new ValidationError('validation_required', 'O assunto é obrigatório')
  if (!body.message)
    missingFields.message = new ValidationError('validation_required', 'A mensagem é obrigatória')
  if (Object.keys(missingFields).length > 0) {
    throw new BadRequestError('Por favor, preencha todos os campos obrigatórios.', missingFields)
  }

  var smtpHost = ''
  var smtpPort = 587
  var smtpUsername = ''
  var smtpPassword = ''
  var smtpEncryption = 'TLS'
  var senderAddress = ''
  var senderName = 'Christófolli Consultoria'
  var adminEmail = ''

  try {
    var existing = $app.findRecordsByFilter('smtp_settings', '', '', 1, 0)
    if (existing.length > 0) {
      var smtpRecord = existing[0]
      smtpHost = smtpRecord.getString('host') || ''
      smtpPort = smtpRecord.getInt('port') || 587
      smtpUsername = smtpRecord.getString('username') || ''
      smtpPassword = smtpRecord.getString('password') || ''
      smtpEncryption = smtpRecord.getString('encryption') || 'TLS'
      senderAddress = smtpRecord.getString('from_email') || ''
      senderName = smtpRecord.getString('from_name') || 'Christófolli Consultoria'
      adminEmail = smtpRecord.getString('admin_email') || ''
    }
  } catch (_) {}
  if (!smtpHost) {
    return e.json(400, {
      success: false,
      error:
        'Configurações de SMTP não definidas. Configure o SMTP no painel administrativo antes de receber contatos.',
    })
  }

  if (!senderAddress) {
    return e.json(400, {
      success: false,
      error:
        'E-mail remetente não definido. Configure o SMTP no painel administrativo antes de receber contatos.',
    })
  }

  var mailClient = $app.newMailClient({
    host: smtpHost,
    port: smtpPort,
    username: smtpUsername,
    password: smtpPassword,
    tls: smtpEncryption === 'TLS' || smtpEncryption === 'SSL',
    auth: smtpUsername ? 'PLAIN' : '',
  })

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

  if (!adminEmail) {
    return e.json(400, {
      success: false,
      error:
        'E-mail do administrador não definido. Configure o e-mail do administrador no painel administrativo antes de receber contatos.',
    })
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

    mailClient.send(
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

    mailClient.send(
      new MailerMessage({
        from: { address: senderAddress, name: senderName },
        to: [{ address: adminEmail }],
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
