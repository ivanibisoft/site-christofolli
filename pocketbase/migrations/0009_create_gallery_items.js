migrate(
  (app) => {
    const collection = new Collection({
      name: 'gallery_items',
      type: 'base',
      listRule: '""',
      viewRule: '""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'category', type: 'text', required: true },
        {
          name: 'image',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('gallery_items')
    app.delete(collection)
  },
)
