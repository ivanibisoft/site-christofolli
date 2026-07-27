migrate(
  (app) => {
    const collections = [
      {
        name: 'audit_services',
        fields: ['title', 'description', 'evaluated_items', 'objectives_and_deliveries'],
      },
      {
        name: 'publications',
        fields: ['title', 'description'],
      },
      {
        name: 'contacts',
        fields: ['subject', 'message', 'company_name'],
      },
      {
        name: 'gallery_items',
        fields: ['title', 'description', 'category'],
      },
      {
        name: 'company_profile',
        fields: ['director_bio'],
      },
      {
        name: 'timeline_items',
        fields: ['title', 'institution', 'description'],
      },
    ]

    for (const col of collections) {
      if (!app.hasTable(col.name)) continue
      for (const field of col.fields) {
        app
          .db()
          .newQuery(
            'UPDATE ' +
              col.name +
              ' SET ' +
              field +
              ' = REPLACE(REPLACE(' +
              field +
              ", 'Auditoria', 'Consultoria'), 'auditoria', 'consultoria') WHERE " +
              field +
              " LIKE '%auditoria%' OR " +
              field +
              " LIKE '%Auditoria%'",
          )
          .execute()
      }
    }
  },
  (app) => {
    const collections = [
      {
        name: 'audit_services',
        fields: ['title', 'description', 'evaluated_items', 'objectives_and_deliveries'],
      },
      {
        name: 'publications',
        fields: ['title', 'description'],
      },
      {
        name: 'contacts',
        fields: ['subject', 'message', 'company_name'],
      },
      {
        name: 'gallery_items',
        fields: ['title', 'description', 'category'],
      },
      {
        name: 'company_profile',
        fields: ['director_bio'],
      },
      {
        name: 'timeline_items',
        fields: ['title', 'institution', 'description'],
      },
    ]

    for (const col of collections) {
      if (!app.hasTable(col.name)) continue
      for (const field of col.fields) {
        app
          .db()
          .newQuery(
            'UPDATE ' +
              col.name +
              ' SET ' +
              field +
              ' = REPLACE(REPLACE(' +
              field +
              ", 'Consultoria', 'Auditoria'), 'consultoria', 'auditoria') WHERE " +
              field +
              " LIKE '%consultoria%' OR " +
              field +
              " LIKE '%Consultoria%'",
          )
          .execute()
      }
    }
  },
)
