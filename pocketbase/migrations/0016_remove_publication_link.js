migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    if (col.fields.getByName('link')) {
      col.fields.removeByName('link')
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    if (!col.fields.getByName('link')) {
      col.fields.add(new TextField({ name: 'link' }))
    }
    app.save(col)
  },
)
