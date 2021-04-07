import yaml from 'js-yaml'
import * as dayjs from 'dayjs'
import { requestOpenApi } from './api'
export const uriBase = 'https://opendata.somenergia.coop/v0.2'

export const loadGeoLevels = async () => {
  const apiGeoLevels = []
  return requestOpenApi(uriBase + '/discover/geolevel').then((yamldata) => {
    const data = yaml.load(yamldata)
    apiGeoLevels.push(...data.geolevels)
    return apiGeoLevels
  })
}

export const loadMetrics = async () => {
  const apiMetrics = []
  return requestOpenApi(uriBase + '/discover/metrics').then((yamldata) => {
    const data = yaml.load(yamldata)
    apiMetrics.push(...data.metrics)
    return apiMetrics
  })
}

export const loadAllLocations = async (geoLevels) => {
  const allLocations = []
  return Promise.all(
    geoLevels.map((geolevel) => {
      if (geolevel.id === 'world') {
        return true
      }
      if (geolevel.id === 'country') {
        return true
      }
      return requestOpenApi(uriBase + `/discover/geolevel/${geolevel.id}`).then(
        (yamldata) => {
          const data = yaml.load(yamldata)
          for (const [id, text] of Object.entries(data.options)) {
            allLocations.push({
              id,
              text,
              level: geolevel,
              filterText: `${text} (${geolevel.text})`,
              filterQuery: `${geolevel.id}=${id}`,
              key: id
            })
          }
        }
      )
    })
  ).then((data) => {
    return allLocations
  })
}

export const geoLevels = ['country', 'ccaa', 'state', 'city']

export const pluralGeoLevels = ['countries', 'ccaas', 'states', 'cities']

export const languages = [
  { name: 'CATALAN', code: 'ca' },
  { name: 'SPANISH', code: 'es' },
  { name: 'BASQUE', code: 'eu' },
  { name: 'GALICIAN', code: 'gl' }
]

export const urlFromOptions = (options) => {
  const {
    responseType,
    metric,
    relative,
    geoLevel,
    time,
    onDate,
    fromDate,
    toDate,
    geoFilters,
    lang,
    format = false
  } = options

  let url = `${uriBase}`

  if (responseType === 'map') {
    url += `/map`
  }

  if (metric !== undefined && metric) {
    url += `/${metric}`
  }

  if (
    responseType === 'map' &&
    relative !== undefined &&
    relative &&
    relative !== 'absolute'
  ) {
    url += `/per/${relative}`
  }

  if (geoLevel !== undefined && geoLevel && geoLevel !== 'world') {
    url += `/by/${geoLevel}`
  }

  switch (time) {
    case 'monthly':
    case 'yearly':
    case 'weekly': {
      url += `/${time}`
      if (fromDate) {
        url += `/from/${fromDate.format('YYYY-MM-DD')}`
      }
      if (toDate) {
        url += `/to/${toDate.format('YYYY-MM-DD')}`
      }
      break
    }
    default: {
      if (onDate) {
        url += `/on/${onDate.format('YYYY-MM-DD')}`
      }
    }
  }

  let queryParams = []

  if (responseType !== 'map') {
    if (geoFilters && geoFilters.length) {
      queryParams.push(...geoFilters.map((filter) => filter.filterQuery))
    }
  } else {
    if (lang && lang !== 'browser') {
      queryParams.push(`lang=${lang}`)
    }
  }

  if (format) {
    queryParams.push(`format=${format}`)
  }

  if (queryParams.length) {
    url += '?' + queryParams.join('&')
  }

  return url
}

export const csvRowData = (data) => {
  const rows = []
  const rowGlobal = {}

  data?.dates?.forEach((date, index) => {
    const formatedDate = dayjs(date).format('DD/MM/YYYY')
    const dateIndex = data.dates.length > 1 ? `date${index}` : 'dates'
    const totalIndex = data.dates.length > 1 ? `total${index}` : 'total'
    rowGlobal[dateIndex] = formatedDate
    rowGlobal[totalIndex] = data.values[index]
  })

  data?.countries
    ? Object.keys(data.countries).forEach((countryCode) => {
        const rowCountry = { ...rowGlobal }
        rowCountry.countryCode = countryCode
        rowCountry.countryName = data.countries[countryCode].name
        data?.dates?.forEach((date, index) => {
          const totalIndex =
            data.dates.length > 1 ? `countryTotal${index}` : 'countryTotal'
          rowCountry[totalIndex] = data.countries[countryCode].values[index]
        })

        data?.countries?.[countryCode]?.ccaas
          ? Object.keys(data.countries[countryCode].ccaas).forEach(
              (ccaaCode) => {
                const rowCcaa = { ...rowCountry }
                rowCcaa.ccaaCode = ccaaCode
                rowCcaa.ccaaName =
                  data.countries[countryCode].ccaas[ccaaCode].name
                data?.dates?.forEach((date, index) => {
                  const totalIndex =
                    data.dates.length > 1 ? `ccaaTotal${index}` : 'ccaaTotal'
                  rowCcaa[totalIndex] =
                    data.countries[countryCode].ccaas[ccaaCode].values[index]
                })

                data?.countries?.[countryCode]?.ccaas?.[ccaaCode]?.states
                  ? Object.keys(
                      data?.countries?.[countryCode]?.ccaas?.[ccaaCode]?.states
                    ).forEach((stateCode) => {
                      const rowState = { ...rowCcaa }
                      rowState.stateCode = stateCode
                      rowState.stateName =
                        data.countries[countryCode].ccaas[ccaaCode].states[
                          stateCode
                        ].name
                      data?.dates?.forEach((date, index) => {
                        const totalIndex =
                          data.dates.length > 1
                            ? `stateTotal${index}`
                            : 'stateTotal'
                        rowState[totalIndex] =
                          data.countries[countryCode].ccaas[ccaaCode].states[
                            stateCode
                          ].values[index]
                      })

                      data?.countries?.[countryCode]?.ccaas?.[ccaaCode]
                        ?.states?.[stateCode]?.cities
                        ? Object.keys(
                            data?.countries?.[countryCode]?.ccaas?.[ccaaCode]
                              ?.states?.[stateCode]?.cities
                          ).forEach((cityCode) => {
                            const rowCity = { ...rowState }
                            rowCity.cityCode = cityCode
                            rowCity.cityName =
                              data.countries[countryCode].ccaas[
                                ccaaCode
                              ].states[stateCode].cities[cityCode].name
                            data?.dates?.forEach((date, index) => {
                              const totalIndex =
                                data.dates.length > 1
                                  ? `cityTotal${index}`
                                  : 'cityTotal'
                              rowCity[totalIndex] =
                                data.countries[countryCode].ccaas[
                                  ccaaCode
                                ].states[stateCode].cities[cityCode].values[
                                  index
                                ]
                            })
                            rows.push(rowCity)
                          })
                        : rows.push(rowState)
                    })
                  : rows.push(rowCcaa)
              }
            )
          : rows.push(rowCountry)
      })
    : rows.push(rowGlobal)

  return rows
}
