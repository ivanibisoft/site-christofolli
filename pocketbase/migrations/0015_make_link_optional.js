migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    const linkField = col.fields.getByName('link')
    linkField.required = false
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    const linkField = col.fields.getByName('link')
    linkField.required = true
    app.save(col)
  },
)
