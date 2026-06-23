migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('contacts')

    if (!collection.fields.getByName('company_name')) {
      collection.fields.add(new TextField({ name: 'company_name' }))
    }
    if (!collection.fields.getByName('whatsapp')) {
      collection.fields.add(new TextField({ name: 'whatsapp' }))
    }

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('contacts')
    collection.fields.removeByName('company_name')
    collection.fields.removeByName('whatsapp')
    app.save(collection)
  },
)
