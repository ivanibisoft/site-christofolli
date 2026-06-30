migrate(
  (app) => {
    const collection = new Collection({
      name: 'company_profile',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: "@request.auth.id != ''",
      deleteRule: null,
      fields: [
        {
          name: 'director_photo',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('company_profile')
    app.delete(collection)
  },
)
