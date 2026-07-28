routerAdd(
  'POST',
  '/backend/v1/publications/{id}/notify',
  (e) => {
    var pubId = e.request.pathValue('id')

    var record
    try {
      record = $app.findRecordById('publications', pubId)
    } catch (_) {
      return e.json(200, { success: false, error: 'Publicação não encontrada' })
    }

    var category = record.getString('category')
    if (category !== 'Blog') {
      return e.json(200, { success: true, count: 0, skipped: true })
    }

    var smtpHost = ''
    var smtpPort = 587
    var smtpUsername = ''
    var smtpPassword = ''
    var smtpEncryption = 'TLS'
    var senderAddress = ''
    var senderName = 'Christófolli Consultoria'

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
      }
    } catch (smtpFetchErr) {
      $app
        .logger()
        .error(
          'Failed to fetch SMTP settings for publication notification',
          'error',
          smtpFetchErr.message,
          'publicationId',
          pubId,
        )
      return e.json(200, {
        success: false,
        error: 'Configurações de SMTP não puderam ser carregadas.',
      })
    }

    if (!smtpHost) {
      return e.json(200, {
        success: false,
        error: 'Configurações de SMTP não definidas. Configure o SMTP no painel administrativo.',
      })
    }

    if (!senderAddress) {
      return e.json(200, {
        success: false,
        error: 'E-mail remetente não definido. Configure o SMTP no painel administrativo.',
      })
    }

    var contacts = []
    try {
      contacts = $app.findRecordsByFilter('contacts', "email != ''", '', 0, 0)
    } catch (fetchErr) {
      return e.json(200, {
        success: false,
        error: 'Erro ao buscar contatos: ' + fetchErr.message,
      })
    }

    if (contacts.length === 0) {
      return e.json(200, { success: true, count: 0 })
    }

    var escapeHtml = function (str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    var title = record.getString('title')
    var description = record.getString('description') || ''

    var descLines = description.split('\n').filter(function (line) {
      return line.trim().length > 0
    })
    var firstFiveLines = descLines.slice(0, 5).join('\n')
    var safeDesc = escapeHtml(firstFiveLines).replace(/\n/g, '<br />')
    var safeTitle = escapeHtml(title)

    var pbUrl = $secrets.get('PB_INSTANCE_URL') || ''
    var coverImage = record.getString('cover_image')
    var coverUrl = coverImage
      ? pbUrl + '/api/files/' + record.collectionId + '/' + record.id + '/' + coverImage
      : ''

    var siteUrl = $secrets.get('SITE_URL') || 'https://consultoria-concreto-tech-191de.goskip.app'
    var postUrl = siteUrl.replace(/\/$/, '') + '/publicacoes/' + record.id

    var coverHtml = ''
    if (coverUrl) {
      coverHtml =
        '<div style="margin-bottom:24px;text-align:center;">' +
        '<img src="' +
        coverUrl +
        '" alt="' +
        safeTitle +
        '" style="max-width:100%;width:600px;border-radius:8px;display:block;margin:0 auto;" />' +
        '</div>'
    }

    var descHtml = ''
    if (safeDesc) {
      descHtml =
        '<div style="background:#f4f4f5;padding:15px;border-radius:6px;border:1px solid #e4e4e7;margin:20px 0;">' +
        '<p style="margin:0;font-size:14px;color:#555;line-height:1.6;">' +
        safeDesc +
        '</p>' +
        '</div>'
    }

    var htmlBody =
      '<div style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto;">' +
      '<div style="background-color:#1e3a5f;padding:20px;border-radius:8px 8px 0 0;text-align:center;">' +
      '<h1 style="color:#ffffff;margin:0;font-size:22px;">' +
      escapeHtml(senderName) +
      '</h1>' +
      '<p style="color:#c0d4e8;margin:5px 0 0 0;font-size:14px;">Nova Publicação do Blog</p>' +
      '</div>' +
      '<div style="padding:30px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 8px 8px;">' +
      '<h2 style="color:#1e3a5f;margin:0 0 15px 0;font-size:20px;">' +
      safeTitle +
      '</h2>' +
      coverHtml +
      descHtml +
      '<div style="text-align:center;margin:30px 0 10px 0;">' +
      '<a href="' +
      escapeHtml(postUrl) +
      '" style="display:inline-block;background-color:#1e3a5f;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:6px;font-weight:bold;font-size:15px;">Acessar postagem completa</a>' +
      '</div>' +
      '<p style="font-size:13px;color:#888;text-align:center;margin-top:20px;">' +
      'Você recebeu este e-mail porque está cadastrado em nossa lista de contatos.' +
      '</p>' +
      '</div>' +
      '<div style="text-align:center;padding:15px;color:#999;font-size:12px;">' +
      '<p style="margin:0;">Este é um e-mail automático. Por favor, não responda a esta mensagem.</p>' +
      '</div>' +
      '</div>'

    var bccRecipients = []
    for (var i = 0; i < contacts.length; i++) {
      bccRecipients.push({ address: contacts[i].getString('email') })
    }

    var mailClient = $app.newMailClient({
      host: smtpHost,
      port: smtpPort,
      username: smtpUsername,
      password: smtpPassword,
      tls: smtpEncryption === 'TLS' || smtpEncryption === 'SSL',
      auth: smtpUsername ? 'PLAIN' : '',
    })

    try {
      var msg = new MailerMessage({
        from: { address: senderAddress, name: senderName },
        to: [{ address: senderAddress }],
        bcc: bccRecipients,
        subject: title,
        html: htmlBody,
      })
      mailClient.send(msg)

      $app
        .logger()
        .info('Publication notification sent', 'contacts', contacts.length, 'publicationId', pubId)

      return e.json(200, { success: true, count: contacts.length })
    } catch (sendErr) {
      $app
        .logger()
        .error(
          'Erro ao enviar notificacao de publicacao',
          'error',
          sendErr.message,
          'publicationId',
          pubId,
        )
      return e.json(200, {
        success: false,
        error: sendErr.message || 'Erro ao enviar e-mails',
      })
    }
  },
  $apis.requireAuth(),
)
