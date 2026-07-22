migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    if (!col.fields.getByName('cover_image')) {
      col.fields.add(
        new FileField({
          name: 'cover_image',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    col.fields.removeByName('cover_image')
    app.save(col)
  },
)
