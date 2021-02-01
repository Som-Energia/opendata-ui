import yaml from 'js-yaml'
import { requestOpenApi } from './api'
export const uriBase = 'https://opendata.somenergia.coop/v0.2'

export const loadGeoLevels = async () => {
  const apiGeoLevels = []
  return requestOpenApi(uriBase+'/discover/geolevel')
    .then(yamldata => {
      const data = yaml.load(yamldata)
      apiGeoLevels.push(...data.geolevels)
      return apiGeoLevels
    })
}

export const loadMetrics = async () => {
  const apiMetrics = []
  return requestOpenApi(uriBase+'/discover/metrics')
    .then(yamldata => {
      const data = yaml.load(yamldata)
      apiMetrics.push(...data.metrics)
      return apiMetrics
    })
}

export const loadAllLocations = async (geoLevels) => {
  const allLocations = []
  return Promise.all(geoLevels.map(geolevel => {
    if (geolevel.id === 'world') { return true; }
    if (geolevel.id === 'country') { return true; }
    return requestOpenApi(uriBase+`/discover/geolevel/${geolevel.id}`)
      .then(yamldata => {
        const data = yaml.load(yamldata)
        for (const [id, text] of Object.entries(data.options)) {
          allLocations.push({
            id,
            text,
            level: geolevel,
            filterText: `${text} (${geolevel.text})`,
            filterQuery: `${geolevel.id}=${id}`,
            key: id,
          })
        }
      })
    })
  ).then( data => {
    return allLocations
  })
}

export const geoLevels = [
  'country', 'ccaa', 'state', 'city'
]

export const pluralGeoLevels = [
  'countries', 'ccaas', 'states', 'cities'
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
  } = options

  let url = `${uriBase}`

  if(responseType === 'map'){
    url += `/map`
  }

  if(metric !== undefined && metric ){
    url += `/${metric}`
  }

  if(responseType === 'map' && relative !== undefined && relative && relative !== 'absolute'){
    url += `/per/${relative}`
  }

  if(geoLevel !== undefined && geoLevel && geoLevel !== 'world'){
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
      break;
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
      queryParams.push(...geoFilters.map(filter => filter.filterQuery))
    }
  }
  else {
    if (lang && lang !=='browser') {
      queryParams.push(`lang=${lang}`)
    }
  }

  if (queryParams.length) {
    url += '?' + queryParams.join('&')
  }

  return url
}
