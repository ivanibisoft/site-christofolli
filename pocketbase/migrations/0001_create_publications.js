migrate(
  (app) => {
    const collection = new Collection({
      name: 'publications',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'published_date', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)

    const record = new Record(collection)
    record.set(
      'title',
      'Influence of specific surface area of limestone filler on the cement hydration and properties of cement-based materials',
    )
    record.set(
      'link',
      'https://www.sciencedirect.com/science/article/abs/pii/S0950061824046129?via%3Dihub',
    )
    app.save(record)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('publications')
    app.delete(collection)
  },
)
