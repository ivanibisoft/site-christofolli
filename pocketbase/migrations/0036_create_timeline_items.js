migrate(
  (app) => {
    const collection = new Collection({
      name: 'timeline_items',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'institution', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'period', type: 'text' },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['professional', 'academic'],
          maxSelect: 1,
        },
        { name: 'order', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_timeline_items_order ON timeline_items (order)',
        'CREATE INDEX idx_timeline_items_type ON timeline_items (type)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('timeline_items')
    app.delete(collection)
  },
)
