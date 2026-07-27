routerAdd(
  'POST',
  '/backend/v1/publications/{id}/notify',
  (e) => {
    try {
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
      var safeTitle = escapeHtml(title)
      var safeDesc = escapeHtml(description).replace(/\n/g, '<br />')

      var senderAddress = $app.settings().meta.senderAddress
      var senderName = $app.settings().meta.senderName || 'Christófolli Consultoria'

      if (!senderAddress) {
        return e.json(200, {
          success: false,
          error:
            'SMTP não configurado. Configure o remetente em Settings → Mail no painel do PocketBase.',
        })
      }

      var pbUrl = $secrets.get('PB_INSTANCE_URL') || ''
      var coverImage = record.getString('cover_image')
      var coverUrl = coverImage
        ? pbUrl + '/api/files/' + record.collectionId + '/' + record.id + '/' + coverImage
        : ''

      var siteUrl = $secrets.get('SITE_URL') || 'https://consultoria-concreto-tech-191de.goskip.app'

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
        '<h1 style="color:#ffffff;margin:0;font-size:22px;">Christófolli Consultoria</h1>' +
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

      var recipients = []
      for (var i = 0; i < contacts.length; i++) {
        recipients.push({ address: contacts[i].getString('email') })
      }

      var msg = new MailerMessage({
        from: { address: senderAddress, name: senderName },
        to: recipients,
        subject: 'Nova Publicação do Blog: ' + title,
        html: htmlBody,
      })

      $app.newMailClient().send(msg)

      $app
        .logger()
        .info('Publication notification sent', 'contacts', contacts.length, 'publicationId', pubId)

      return e.json(200, { success: true, count: contacts.length })
    } catch (err) {
      $app
        .logger()
        .error(
          'Erro ao enviar notificacao de publicacao',
          'error',
          err.message,
          'publicationId',
          e.request.pathValue('id'),
        )
      return e.json(200, { success: false, error: err.message || 'Erro ao enviar e-mails' })
    }
  },
  $apis.requireAuth(),
)
