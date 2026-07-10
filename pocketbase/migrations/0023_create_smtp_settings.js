migrate(
  (app) => {
    const collection = new Collection({
      name: 'smtp_settings',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'host', type: 'text', required: true },
        { name: 'port', type: 'number', required: true, onlyInt: true, min: 1, max: 65535 },
        { name: 'username', type: 'text', required: true },
        { name: 'password', type: 'text', required: true },
        { name: 'encryption', type: 'text', required: true },
        { name: 'from_email', type: 'email', required: true },
        { name: 'from_name', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('smtp_settings')
    app.delete(collection)
  },
)
