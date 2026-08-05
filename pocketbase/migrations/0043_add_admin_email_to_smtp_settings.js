migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('smtp_settings')

    if (!col.fields.getByName('admin_email')) {
      col.fields.add(
        new EmailField({
          name: 'admin_email',
          required: false,
        }),
      )
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('smtp_settings')
    const field = col.fields.getByName('admin_email')
    if (field) {
      col.fields.remove(field)
      app.save(col)
    }
  },
)
