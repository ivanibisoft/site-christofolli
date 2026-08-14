migrate(
  (app) => {
    const collection = new Collection({
      name: 'page_settings',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'page', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'subtitle', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_page_settings_page ON page_settings (page)'],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('page_settings')
    app.delete(collection)
  },
)
