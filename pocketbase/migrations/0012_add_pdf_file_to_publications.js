migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    col.fields.add(
      new FileField({
        name: 'pdf_file',
        maxSelect: 1,
        maxSize: 52428800,
        mimeTypes: ['application/pdf'],
      }),
    )
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    col.fields.removeByName('pdf_file')
    app.save(col)
  },
)
