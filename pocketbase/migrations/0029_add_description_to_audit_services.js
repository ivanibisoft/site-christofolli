migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('audit_services')
    if (!col.fields.getByName('description')) {
      col.fields.add(
        new TextField({
          name: 'description',
          required: false,
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('audit_services')
    const field = col.fields.getByName('description')
    if (field) {
      col.fields.remove(field)
    }
    app.save(col)
  },
)
