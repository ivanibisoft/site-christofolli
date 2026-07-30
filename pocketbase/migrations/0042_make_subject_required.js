migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('contacts')
    const field = col.fields.getByName('subject')
    if (field) {
      field.required = true
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('contacts')
    const field = col.fields.getByName('subject')
    if (field) {
      field.required = false
    }
    app.save(col)
  },
)
