onRecordValidate((e) => {
  const link = e.record.getString('link').trim()
  const pdfFile = e.record.getString('pdf_file').trim()
  if (!link && !pdfFile) {
    throw new BadRequestError('Por favor, forneça um link de acesso ou anexe um arquivo PDF.', {
      link: new ValidationError(
        'validation_required',
        'Por favor, forneça um link de acesso ou anexe um arquivo PDF.',
      ),
    })
  }
  e.next()
}, 'publications')
