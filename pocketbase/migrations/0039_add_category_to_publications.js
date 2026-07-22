migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    if (!col.fields.getByName('category')) {
      col.fields.add(
        new SelectField({
          name: 'category',
          required: false,
          values: ['Blog', 'Technical'],
          maxSelect: 1,
        }),
      )
    }
    app.save(col)

    app
      .db()
      .newQuery(
        "UPDATE publications SET category = 'Technical' WHERE category IS NULL OR category = ''",
      )
      .execute()
  },
  (app) => {
    const col = app.findCollectionByNameOrId('publications')
    if (col.fields.getByName('category')) {
      col.fields.removeByName('category')
    }
    app.save(col)
  },
)
