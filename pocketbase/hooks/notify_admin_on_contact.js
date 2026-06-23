onRecordAfterCreateSuccess((e) => {
  try {
    const m = 'mailer'
    const mailer = require(m)

    const name = e.record.getString('name')
    const email = e.record.getString('email')
    const subject = e.record.getString('subject') || 'Sem Assunto'
    const company = e.record.getString('company_name') || '-'
    const whatsapp = e.record.getString('whatsapp') || '-'
    const messageText = e.record.getString('message')

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
            <td><a href="mailto:${email}">${email}</a></td>
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
          ${messageText.replace(/\n/g, '<br />')}
        </div>
      </div>
    `

    const msg = new mailer.Message({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName || 'Site Christófolli Consultoria',
      },
      to: [{ address: 'ivan@ibisoft.com.br' }],
      subject: `Novo Contato Recebido: ${subject}`,
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
