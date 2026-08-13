migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('builder_services')

    const seeds = [
      {
        title: 'Concretos Especiais (CAD/CAA)',
        icon: 'Flask',
        description:
          'Especificação de Concreto de Alto Desempenho (CAD) para permitir pilares mais esbeltos, resultando em maior área útil e menor consumo de aço e formas.',
        topics: 'Redução de volume de concreto\nVelocidade na desforma\nAcabamento superior',
        order: 1,
      },
      {
        title: 'Comportamento Térmico',
        icon: 'Thermometer',
        description:
          'Simulação e controle de temperatura em blocos de fundação para evitar fissuração de origem térmica. Cálculo de adições e necessidade de resfriamento.',
        topics:
          'Modelagem térmica preditiva\nEspecificação de gelo/nitrogênio\nPrevenção de RAA e DEF',
        order: 2,
      },
      {
        title: 'Sustentabilidade (ESG)',
        icon: 'Leaf',
        description:
          'Estudos específicos desde a participação na concepção do projeto estrutural até a aplicação do concreto, visando:',
        topics:
          'Redução das emissões de CO2 na estrutura\nMenor volume de concreto\nMenor peso estrutural\nMenor quantidade de aço\nAumento de área útil da edificação\nMenor área de fôrmas\nRedução da mão de obra para aplicação\nMaior durabilidade e vida útil da estrutura\nUso otimizado de adições',
        order: 3,
      },
    ]

    seeds.forEach((seed) => {
      try {
        app.findFirstRecordByData('builder_services', 'title', seed.title)
      } catch (_) {
        const record = new Record(collection)
        record.set('title', seed.title)
        record.set('icon', seed.icon)
        record.set('description', seed.description)
        record.set('topics', seed.topics)
        record.set('order', seed.order)
        app.save(record)
      }
    })
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('builder_services')
      app.truncateCollection(collection)
    } catch (_) {}
  },
)
