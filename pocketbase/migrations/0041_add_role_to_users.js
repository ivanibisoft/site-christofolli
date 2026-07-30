migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!col.fields.getByName('role')) {
      col.fields.add(
        new SelectField({
          name: 'role',
          values: ['admin', 'user'],
          maxSelect: 1,
        }),
      )
    }

    col.listRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    col.viewRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    col.createRule = "@request.auth.role = 'admin'"
    col.updateRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    col.deleteRule = "id = @request.auth.id || @request.auth.role = 'admin'"

    app.save(col)

    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'ivan@ibisoft.com.br')
      record.set('role', 'admin')
      app.save(record)
    } catch (_) {}

    try {
      const allUsers = app.findRecordsByFilter('_pb_users_auth_', '', '-created', 0, 0)
      for (const u of allUsers) {
        if (!u.getString('role')) {
          u.set('role', 'user')
          app.save(u)
        }
      }
    } catch (_) {}
  },
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')

    col.listRule = 'id = @request.auth.id'
    col.viewRule = 'id = @request.auth.id'
    col.createRule = ''
    col.updateRule = 'id = @request.auth.id'
    col.deleteRule = 'id = @request.auth.id'

    const field = col.fields.getByName('role')
    if (field) {
      col.fields.remove(field.getId())
    }

    app.save(col)
  },
)
