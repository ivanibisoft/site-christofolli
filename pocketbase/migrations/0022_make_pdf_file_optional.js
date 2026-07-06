migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    const pdfField = col.fields.getByName('pdf_file')
    if (pdfField) {
      pdfField.required = false
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    const pdfField = col.fields.getByName('pdf_file')
    if (pdfField) {
      pdfField.required = true
    }
    app.save(col)
  },
)
