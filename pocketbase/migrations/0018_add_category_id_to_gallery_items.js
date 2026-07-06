migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('gallery_items')
    if (!col.fields.getByName('category_id')) {
      col.fields.add(
        new RelationField({
          name: 'category_id',
          collectionId: app.findCollectionByNameOrId('gallery_categories').id,
          maxSelect: 1,
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('gallery_items')
    col.fields.removeByName('category_id')
    app.save(col)
  },
)
