onRecordValidate((e) => {
  const pdfFile = e.record.getString('pdf_file').trim()
  if (!pdfFile) {
    throw new BadRequestError('O anexo do PDF é obrigatório.', {
      pdf_file: new ValidationError('validation_required', 'O anexo do PDF é obrigatório.'),
    })
  }
  if (pdfFile && !pdfFile.toLowerCase().endsWith('.pdf')) {
    throw new BadRequestError('Apenas arquivos PDF são permitidos.', {
      pdf_file: new ValidationError(
        'validation_invalid_file_format',
        'Apenas arquivos PDF são permitidos.',
      ),
    })
  }
  e.next()
}, 'publications')
