onRecordAfterCreateSuccess((e) => {
  try {
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

    const rawName = e.record.getString('name')
    const rawEmail = e.record.getString('email')
    const rawSubject = e.record.getString('subject') || 'Sem Assunto'
    const rawCompany = e.record.getString('company_name') || '-'
    const rawWhatsapp = e.record.getString('whatsapp') || '-'
    const rawMessage = e.record.getString('message')

    const name = escapeHtml(rawName)
    const email = escapeHtml(rawEmail)
    const subject = escapeHtml(rawSubject)
    const company = escapeHtml(rawCompany)
    const whatsapp = escapeHtml(rawWhatsapp)
    const messageText = escapeHtml(rawMessage).replace(/\n/g, '<br />')

    const htmlBody = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Novo Contato Recebido</h2>
        <p>Um novo formulário de contato foi enviado através do site.</p>
        <table border="0" cellpadding="5" cellspacing="0" style="text-align: left;">
          <tr>
            <th style="width: 80px;">Nome:</th>
            <td>${name}</td>
          </tr>
          <tr>
            <th>E-mail:</th>
            <td><a href="mailto:${rawEmail}">${email}</a></td>
          </tr>
          <tr>
            <th>Empresa:</th>
            <td>${company}</td>
          </tr>
          <tr>
            <th>WhatsApp:</th>
            <td>${whatsapp}</td>
          </tr>
          <tr>
            <th>Assunto:</th>
            <td>${subject}</td>
          </tr>
        </table>
        <br />
        <p><strong>Mensagem:</strong></p>
        <div style="background: #f4f4f5; padding: 15px; border-radius: 6px; border: 1px solid #e4e4e7;">
          ${messageText}
        </div>
      </div>
    `

    const msg = new mailer.Message({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName || 'Site Christófolli Consultoria',
      },
      to: [{ address: 'jorge@christofolli.com.br' }],
      subject: `Novo Contato Recebido: ${rawSubject}`,
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
