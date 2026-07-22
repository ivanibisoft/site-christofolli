onRecordAfterCreateSuccess((e) => {
  try {
    let contacts = []
    try {
      contacts = $app.findRecordsByFilter('contacts', "email != ''", '', 0, 0)
    } catch (fetchErr) {
      $app
        .logger()
        .warn('Failed to fetch contacts for publication notification', 'error', fetchErr.message)
    }

    if (contacts.length === 0) {
      e.next()
      return
    }

    const m = 'mailer'
    const mailer = require(m)

    const escapeHtml = (str) => {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    const title = e.record.getString('title')
    const description = e.record.getString('description') || ''
    const safeTitle = escapeHtml(title)
    const safeDesc = escapeHtml(description).replace(/\n/g, '<br />')

    let smtpSettings = null
    try {
      const records = $app.findRecordsByFilter('smtp_settings', "id != ''", '-created', 1, 0)
      if (records.length > 0) {
        smtpSettings = records[0]
      }
    } catch (fetchErr) {
      $app
        .logger()
        .warn(
          'Failed to fetch SMTP settings for publication notification',
          'error',
          fetchErr.message,
        )
    }

    let fromAddress, fromName
    if (smtpSettings) {
      fromAddress = smtpSettings.getString('from_email')
      fromName = smtpSettings.getString('from_name')
    } else {
      fromAddress = $app.settings().meta.senderAddress
      fromName = $app.settings().meta.senderName || 'Christófolli Consultoria'
    }

    const pbUrl = $secrets.get('PB_INSTANCE_URL') || ''
    const coverImage = e.record.getString('cover_image')
    const coverUrl = coverImage
      ? pbUrl + '/api/files/' + e.record.collectionId + '/' + e.record.id + '/' + coverImage
      : ''

    const siteUrl = $secrets.get('SITE_URL') || 'https://consultoria-concreto-tech-191de.goskip.app'

    let coverHtml = ''
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

    let descHtml = ''
    if (safeDesc) {
      descHtml =
        '<div style="background:#f4f4f5;padding:15px;border-radius:6px;border:1px solid #e4e4e7;margin:20px 0;">' +
        '<p style="margin:0;font-size:14px;color:#555;line-height:1.6;">' +
        safeDesc +
        '</p>' +
        '</div>'
    }

    const htmlBody =
      '<div style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto;">' +
      '<div style="background-color:#1e3a5f;padding:20px;border-radius:8px 8px 0 0;text-align:center;">' +
      '<h1 style="color:#ffffff;margin:0;font-size:22px;">Christófolli Consultoria</h1>' +
      '<p style="color:#c0d4e8;margin:5px 0 0 0;font-size:14px;">Nova Publicação Técnica</p>' +
      '</div>' +
      '<div style="padding:30px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 8px 8px;">' +
      '<h2 style="color:#1e3a5f;margin:0 0 15px 0;font-size:20px;">' +
      safeTitle +
      '</h2>' +
      coverHtml +
      descHtml +
      '<div style="text-align:center;margin:30px 0 10px 0;">' +
      '<a href="' +
      siteUrl +
      '" style="display:inline-block;background-color:#1e3a5f;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:6px;font-weight:bold;font-size:15px;">Acessar Publicação</a>' +
      '</div>' +
      '<p style="font-size:13px;color:#888;text-align:center;margin-top:20px;">' +
      'Você recebeu este e-mail porque está cadastrado em nossa lista de contatos.<br/>' +
      'Visite <a href="' +
      siteUrl +
      '" style="color:#1e3a5f;">' +
      siteUrl +
      '</a> para mais informações.' +
      '</p>' +
      '</div>' +
      '<div style="text-align:center;padding:15px;color:#999;font-size:12px;">' +
      '<p style="margin:0;">Este é um e-mail automático. Por favor, não responda a esta mensagem.</p>' +
      '</div>' +
      '</div>'

    const recipients = contacts.map(function (c) {
      return { address: c.getString('email') }
    })

    const msg = new mailer.Message({
      from: { address: fromAddress, name: fromName },
      to: recipients,
      subject: 'Nova Publicação Técnica: ' + title,
      html: htmlBody,
    })

    if (smtpSettings) {
      var encryption = smtpSettings.getString('encryption')
      var client = new mailer.SmtpClient({
        host: smtpSettings.getString('host'),
        port: smtpSettings.getInt('port'),
        username: smtpSettings.getString('username'),
        password: smtpSettings.getString('password'),
        ssl: encryption === 'SSL',
      })
      client.send(msg)
    } else {
      $app.newMailClient().send(msg)
    }

    $app
      .logger()
      .info(
        'Publication notification sent',
        'contacts',
        contacts.length,
        'publicationId',
        e.record.id,
      )
  } catch (err) {
    $app
      .logger()
      .error(
        'Erro ao enviar notificacao de nova publicacao para contatos',
        'error',
        err.message,
        'recordId',
        e.record.id,
      )
  }

  e.next()
}, 'publications')
