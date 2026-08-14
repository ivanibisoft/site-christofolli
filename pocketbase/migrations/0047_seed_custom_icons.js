migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('custom_icons')

    const icons = [
      { name: 'FlaskConical', label: 'Béquer' },
      { name: 'Thermometer', label: 'Termômetro' },
      { name: 'Leaf', label: 'Folha' },
      { name: 'LineChart', label: 'Gráfico de Linha' },
      { name: 'HardHat', label: 'Capacete de Obra' },
      { name: 'Zap', label: 'Relâmpago' },
      { name: 'Shield', label: 'Escudo' },
      { name: 'Lightbulb', label: 'Lâmpada' },
      { name: 'Wrench', label: 'Chave Inglesa' },
      { name: 'Settings', label: 'Engrenagens' },
      { name: 'CheckCircle', label: 'Certo' },
      { name: 'AlertTriangle', label: 'Alerta' },
      { name: 'Star', label: 'Estrela' },
      { name: 'Heart', label: 'Coração' },
      { name: 'ThumbsUp', label: 'Joinha' },
      { name: 'Rocket', label: 'Foguete' },
      { name: 'Target', label: 'Alvo' },
      { name: 'TrendingUp', label: 'Tendência de Alta' },
      { name: 'DollarSign', label: 'Cifrão' },
      { name: 'Users', label: 'Pessoas' },
      { name: 'Building', label: 'Prédio' },
      { name: 'Home', label: 'Casa' },
      { name: 'Mail', label: 'Carta' },
      { name: 'Phone', label: 'Telefone' },
      { name: 'Calendar', label: 'Calendário' },
      { name: 'Clock', label: 'Relógio' },
      { name: 'MapPin', label: 'Marcador' },
      { name: 'FileText', label: 'Documento' },
      { name: 'BookOpen', label: 'Livro Aberto' },
      { name: 'Camera', label: 'Câmera' },
      { name: 'Image', label: 'Imagem' },
      { name: 'Video', label: 'Vídeo' },
      { name: 'Music', label: 'Música' },
      { name: 'Search', label: 'Lupa' },
      { name: 'Bell', label: 'Sino' },
      { name: 'Lock', label: 'Cadeado' },
      { name: 'Key', label: 'Chave' },
      { name: 'Cloud', label: 'Nuvem' },
      { name: 'Sun', label: 'Sol' },
      { name: 'Moon', label: 'Lua' },
      { name: 'Globe', label: 'Globo' },
      { name: 'Package', label: 'Pacote' },
      { name: 'Truck', label: 'Caminhão' },
      { name: 'ShoppingCart', label: 'Carrinho' },
      { name: 'Coffee', label: 'Café' },
      { name: 'Gift', label: 'Presente' },
      { name: 'Award', label: 'Troféu' },
      { name: 'Briefcase', label: 'Maleta' },
      { name: 'GraduationCap', label: 'Formatura' },
      { name: 'Microscope', label: 'Microscópio' },
    ]

    icons.forEach((icon) => {
      try {
        app.findFirstRecordByData('custom_icons', 'name', icon.name)
        // already exists — skip
      } catch (_) {
        const record = new Record(col)
        record.set('name', icon.name)
        record.set('label', icon.label)
        app.save(record)
      }
    })
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('custom_icons')
      app.truncateCollection(col)
    } catch (_) {}
  },
)
