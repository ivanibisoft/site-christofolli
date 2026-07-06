migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('gallery_items')
    const categoryField = col.fields.getByName('category')
    if (categoryField) {
      categoryField.required = false
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('gallery_items')
    const categoryField = col.fields.getByName('category')
    if (categoryField) {
      categoryField.required = true
    }
    app.save(col)
  },
)
