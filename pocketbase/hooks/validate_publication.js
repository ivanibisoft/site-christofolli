onRecordValidate((e) => {
  const pdfFile = e.record.getString('pdf_file').trim()
  if (!pdfFile) {
    throw new BadRequestError('O anexo do PDF é obrigatório.', {
      pdf_file: new ValidationError('validation_required', 'O anexo do PDF é obrigatório.'),
    })
  }
  e.next()
}, 'publications')
