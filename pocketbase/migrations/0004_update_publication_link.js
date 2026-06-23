migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'publications',
        'title',
        'Use of high-energy milling for reducing CO2 emissions in quaternary blends of Portland cement',
      )
      record.set('link', 'https://doi.org/10.1016/j.conbuildmat.2024.139470')
      app.save(record)
    } catch (_) {
      // Record not found, skip
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'publications',
        'title',
        'Use of high-energy milling for reducing CO2 emissions in quaternary blends of Portland cement',
      )
      record.set('link', '#')
      app.save(record)
    } catch (_) {
      // Record not found, skip
    }
  },
)
