migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('publications')

    col.listRule = ''
    col.viewRule = ''
    col.createRule = "@request.auth.id != ''"
    col.updateRule = "@request.auth.id != ''"
    col.deleteRule = "@request.auth.id != ''"

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('publications')

    col.listRule = ''
    col.viewRule = ''
    col.createRule = "@request.auth.id != ''"
    col.updateRule = "@request.auth.id != ''"
    col.deleteRule = "@request.auth.id != ''"

    app.save(col)
  },
)
